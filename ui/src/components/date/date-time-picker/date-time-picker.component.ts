import {Component, forwardRef, Input, ViewChild} from '@angular/core';
import {AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator} from '@angular/forms';
import {MuiDatePickerComponent} from '../date-picker';
import {MuiTimePickerComponent} from '../time-picker';
import {BooleanInput, diff, endOf, format, from, getDateTimeFormat, isDefined, mergeDateTime, now, parse, startOf} from '@termx-health/core-util';

@Component({
  standalone: false,
  selector: 'm-date-time-picker',
  templateUrl: 'date-time-picker.component.html',
  host: {
    class: 'm-date-time-picker',
    '[attr.name]':'name'
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MuiDateTimePickerComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MuiDateTimePickerComponent),
      multi: true
    }
  ]
})
export class MuiDateTimePickerComponent implements ControlValueAccessor, Validator {
  public static ngAcceptInputType_disabled: boolean | string;

  @Input() public name: string;
  @Input() public mDefaultTime: Date | string;
  @Input() @BooleanInput() public disabled: boolean;
  @Input() public mMin: Date | 'now' | string;
  @Input() public mMax: Date | 'now' | string;

  @ViewChild('datepicker') public datepicker: MuiDatePickerComponent;
  @ViewChild('timepicker') public timepicker: MuiTimePickerComponent;

  public date: Date;
  public time: Date;

  public onChange: (x: Date) => void;
  public onTouch: () => void;


  /* CVA */

  public writeValue(obj: Date | string): void {
    if (obj) {
      this.date = this.time = new Date(obj);
    } else {
      this.date = this.time = null;
    }
  }


  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }


  /* Value changes */

  public onDatePicked(_date: Date): void {
    if (!this.date) {
      this.time = null;
    }
    if (!this.time && this.date) {
      this.time = this.getDefaultTime();
    }

    this.emitChange();

    if (this.date) {
      this.timepicker.focus();
    }
  }

  public onTimeChange(_date: Date): void {
    this.emitChange();
  }

  private emitChange(): void {
    if (this.disabled) {
      return;
    }
    if (!this.date || !this.time) {
      this.onChange(null);
    } else {
      this.date = mergeDateTime(this.date, this.time);
      this.onChange(this.date);
    }
  }


  /* Validation */

  public validate(control: AbstractControl): ValidationErrors | null {
    if ((this.date && !this.time) || (this.time && !this.date)) {
      return {invalid: true};
    }

    const validator = control.validator?.({} as AbstractControl);
    if (validator?.['required'] && !control.value) {
      return {required: true};
    }

    if (this.disabled || !this.date && !this.time) {
      return;
    }

    const date = typeof this.date === 'string' ? parse(this.date, getDateTimeFormat()) : this.date;
    const baseUnit = 'seconds';

    if (isDefined(this.mMin)) {
      const _min = typeof this.mMin === 'string' ? this.textToDate(this.mMin) : this.mMin;
      if (diff(startOf(date, baseUnit), startOf(_min, baseUnit), baseUnit) < 0) {
        return {minDate: format(_min, getDateTimeFormat())};
      }
    }
    if (isDefined(this.mMax)) {
      const _max = typeof this.mMax === 'string' ? this.textToDate(this.mMax) : this.mMax;
      if (diff(startOf(date, baseUnit), startOf(_max, baseUnit), baseUnit) > 0) {
        return {maxDate: format(_max, getDateTimeFormat())};
      }
    }
  }


  /* Key events */

  public keyEvent(event: KeyboardEvent): void {
    if (this.disabled) {
      return;
    }
    const code = event.code;
    if (code === 'KeyN') {
      this.time = new Date();
      this.date = new Date();
      this.datepicker.closeCalendar();
    } else if (code === 'KeyE') {
      this.time = endOf(new Date(), 'days');
      this.date = this.date || new Date();
      this.datepicker.closeCalendar();
    } else if (code === 'KeyS') {
      this.time = startOf(new Date(), 'days');
      this.date = this.date || new Date();
      this.datepicker.closeCalendar();
    }
  }

  /* Utils */

  private getDefaultTime(): Date {
    if (typeof this.mDefaultTime === 'string') {
      const [hours, minutes, seconds] = this.mDefaultTime.split(":");
      const time = new Date();
      time.setHours(Number(hours), Number(minutes), seconds ? Number(seconds) : 0, 0);
      return time;
    }
    return this.mDefaultTime;
  }

  private textToDate(str: string): Date {
    if (str === 'now') {
      return now();
    }
    return from(str);
  }
}
