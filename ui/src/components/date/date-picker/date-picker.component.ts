import {Component, DestroyRef, ElementRef, EventEmitter, forwardRef, Input, OnChanges, OnInit, Output, ViewChild} from '@angular/core';
import {AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator} from '@angular/forms';
import {pairwise, startWith, Subject} from 'rxjs';
import {
  add,
  BooleanInput,
  CoreI18nService,
  diff,
  findFocusableElement,
  format,
  from,
  getDateFormat,
  getLocale,
  group,
  isDefined,
  isValid,
  mergeDateTime,
  now,
  parse,
  startOf,
  subtract
} from '@termx-health/core-util';
import {NzDatePickerComponent} from 'ng-zorro-antd/date-picker';
import {distinctUntilChanged} from 'rxjs/operators';
import {NgChanges} from '../../core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';


export interface MuiDatePickerYearChange {
  year: number
}

export interface MuiDatePickerMonthChange {
  year: number,
  month: number
}

@Component({
  standalone: false,
  selector: 'm-date-picker',
  templateUrl: 'date-picker.component.html',
  host: {
    class: 'm-date-picker',
    '[attr.name]': 'name'
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MuiDatePickerComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MuiDatePickerComponent),
      multi: true
    }
  ],
})
export class MuiDatePickerComponent implements ControlValueAccessor, OnInit, OnChanges, Validator {
  public static ngAcceptInputType_mDisabledTime: boolean | string;
  public static ngAcceptInputType_mInline: boolean | string;
  public static ngAcceptInputType_disabled: boolean | string;

  @Input() public name: string;
  @Input() @BooleanInput() public mDisableTime: boolean;
  @Input() public mAllowClear: boolean = true;
  @Input() public mMin: Date | 'now' | string;
  @Input() public mMax: Date | 'now' | string;
  @Input() public mDateStyles: {[date: string]: string}; // ISO string -> CSS class; ISO date should be in [startOf(date), endOf(date)] range
  @Input() @BooleanInput() public mInline: boolean;
  @Input() @BooleanInput() public disabled: boolean;

  @Output() public mYearChange = new EventEmitter<MuiDatePickerYearChange>();
  @Output() public mMonthChange = new EventEmitter<MuiDatePickerMonthChange>();

  protected dateFormat?: string;
  protected dateStyles?: {[date: number]: string};
  protected placeholder: string = 'marina.ui.inputs.datePicker.placeholder';

  @ViewChild('textInput') public textInput: ElementRef<HTMLInputElement>;
  protected value = '';
  protected mask: RegExp[];
  protected date: Date;

  private antDatePicker: NzDatePickerComponent;
  private antDatePickerActiveDateChange = new Subject<Date>();

  @ViewChild(NzDatePickerComponent)
  public set _antDatePicker(dp: NzDatePickerComponent) {
    this.antDatePicker = dp;
    this.subscribeToActiveDateChange(dp);
  };


  private onChange: (x: Date) => void;
  // private onTouch: () => void;

  public constructor(
    private ti18nService: CoreI18nService,
    private destroyRef: DestroyRef
  ) { }

  public ngOnChanges(changes: NgChanges<MuiDatePickerComponent>): void {
    const {mDateStyles} = changes;
    if (mDateStyles) {
      const styles = this.mDateStyles ?? {};
      this.dateStyles = group(Object.keys(styles), k => startOf(from(k), 'days').getTime(), k => styles[k]);
    }
  }

  public ngOnInit(): void {
    this.ti18nService.localeChange.pipe(
      takeUntilDestroyed(this.destroyRef),
      startWith(getLocale())
    ).subscribe(() => {
      this.dateFormat = this.getDateFormat();
      this.mask = this.formatToMask(this.dateFormat);
      this.value = isValid(this.date) ? format(this.date, this.dateFormat) : '';
      this.placeholder = this.dateFormat.replace(/[a-zA-Z]/g, '_');
    });

    this.antDatePickerActiveDateChange.pipe(
      takeUntilDestroyed(this.destroyRef),
      distinctUntilChanged((p, c) => p?.getTime() === c?.getTime()),
      pairwise()
    ).subscribe(([prev, next]: [Date, Date]) => {
      const monthChange = prev?.getMonth() !== next?.getMonth();
      const yearChange = prev?.getFullYear() !== next?.getFullYear();

      if (monthChange || yearChange) {
        this.mMonthChange.emit({year: next?.getFullYear(), month: next?.getMonth()});
      }
      if (yearChange) {
        this.mYearChange.emit({year: next?.getFullYear()});
      }
    });
  }


  /* External API*/

  public openCalendar(): void {
    this.antDatePicker.open();
    window.setTimeout(() => findFocusableElement(this.textInput.nativeElement)?.focus());
  }

  public closeCalendar(): void {
    this.antDatePicker.close();
    this.antDatePicker['cdr'].detectChanges();
  }


  /* CVA */

  public writeValue(obj: Date | string): void {
    if (!obj) {
      this.value = '';
      this.date = undefined;
      return;
    }
    const d = typeof obj === 'string' ? parse(obj, this.dateFormat) : obj;
    this.date = d;
    this.value = format(d, this.dateFormat);
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(_fn: any): void {
    // this.onTouch = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }


  /* Value changes */

  protected onDatePick(date: Date): void {
    this.fireOnChange(date);
  }

  protected onValueChange(): void {
    if (!this.value || this.value.indexOf('_') === -1) {
      this.fireOnChange(this.value);
    }
  }


  private fireOnChange(date: Date | string): void {
    const _date = typeof date === 'string' ? parse(date, this.dateFormat) : date;
    this.date = isValid(_date) ? mergeDateTime(_date, this.date) : null;
    this.emitChange();
  }

  private emitChange(): void {
    if (!this.disabled) {
      this.value = isValid(this.date) ? format(this.date, this.dateFormat) : this.value;
      this.onChange?.(this.date);
    }
  }

  public clearValue(): void {
    if (!this.disabled) {
      this.date = null;
      this.value = '';
      this.emitChange();
    }
  }


  /* Validation */

  public validate(control: AbstractControl): ValidationErrors | null {
    const validator = control.validator?.({} as AbstractControl);
    if (validator?.['required'] && !control.value) {
      return {required: true};
    }

    if (this.disabled || !this.date) {
      return;
    }

    const date = typeof this.date === 'string' ? parse(this.date, this.dateFormat) : this.date;
    const baseUnit = 'days';

    if (isDefined(this.mMin)) {
      const _min = typeof this.mMin === 'string' ? this.textToDate(this.mMin) : this.mMin;
      if (diff(startOf(date, baseUnit), startOf(_min, baseUnit), baseUnit) < 0) {
        return {minDate: format(_min, this.dateFormat)};
      }
    }
    if (isDefined(this.mMax)) {
      const _max = typeof this.mMax === 'string' ? this.textToDate(this.mMax) : this.mMax;
      if (diff(startOf(date, baseUnit), startOf(_max, baseUnit), baseUnit) > 0) {
        return {maxDate: format(_max, this.dateFormat)};
      }
    }
  }

  /* Mask */

  private formatToMask(format: string): RegExp[] {
    const masks = {
      'y': [/[0-9]/, /[0-9]/, /[0-9]/, /[0-9]/],
      'm': [/[0-9]*/, /[0-9]/],
      'd': [/[0-9]*/, /[0-9]/],
    };
    const tokens = format
      .replace('yyyy', 'y')
      .replace('yy', 'y')
      .replace('MM', 'm')
      .replace('M', 'm')
      .replace('dd', 'd')
      .split('');
    return tokens.map(t => masks[t] || [t]).reduce((a, b) => [...a, ...b], []);
  }

  /**
   * ACHTUNG: supports formats containing 'd', 'M' and 'y' tokens only.
   */
  private getDateFormat(): string {
    let format = getDateFormat();
    const yearTokenCnt = format.match(/y/g)?.length;
    const monthTokenCnt = format.match(/M/g)?.length;
    const dayTokenCnt = format.match(/d/g)?.length;

    if (yearTokenCnt && yearTokenCnt != 2) {
      format = format.replace('y'.repeat(yearTokenCnt), 'yyyy');
    }
    if (monthTokenCnt && monthTokenCnt != 2) {
      format = format.replace('M'.repeat(monthTokenCnt), 'MM');
    }
    if (dayTokenCnt && dayTokenCnt != 2) {
      format = format.replace('d'.repeat(dayTokenCnt), 'dd');
    }
    return format;
  }


  /* Key events */

  protected keyEvent(event: KeyboardEvent): void {
    if (this.disabled) {
      return;
    }
    const code = event.code;
    if (code === 'KeyN') {
      this.value = format(new Date(), this.dateFormat);
      this.closeCalendar();
    } else if (code === 'KeyY') {
      this.value = format(subtract(new Date(), 1, 'days'), this.dateFormat);
      this.closeCalendar();
    } else if (code === 'KeyT') {
      this.value = format(add(new Date(), 1, 'days'), this.dateFormat);
      this.closeCalendar();
    } else if (code === 'Enter' || code === 'Space') {
      event.preventDefault();
      this.openCalendar();
    } else if (code === 'Tab') {
      this.closeCalendar();
    }
  }


  /* Utils */

  protected isDisabledDate = (current: Date): boolean => {
    if (isDefined(this.mMin) || isDefined(this.mMax)) {
      const _min = typeof this.mMin === 'string' ? this.textToDate(this.mMin) : this.mMin;
      const _max = typeof this.mMax === 'string' ? this.textToDate(this.mMax) : this.mMax;

      const min = !this.mMin || diff(current, startOf(_min, 'days'), 'days') >= 0;
      const max = !this.mMax || diff(current, startOf(_max, 'days'), 'days') <= 0;
      return !min || !max;
    }
    return false;
  };

  private textToDate(str: string): Date {
    if (str === 'now') {
      return now();
    }
    return from(str);
  }


  protected getDateStyles = (date: Date, styles: {[date: number]: string}): string => {
    return styles?.[startOf(date, 'days').getTime()];
  };


  private subscribeToActiveDateChange(dp: NzDatePickerComponent): void {
    const emitChange = () => {
      const ad = dp.datePickerService.activeDate;
      this.antDatePickerActiveDateChange.next((Array.isArray(ad) ? ad[0] : ad)?.nativeDate);
    };

    const _fun = dp.datePickerService.setActiveDate;
    dp.datePickerService.setActiveDate = function (...args) {
      _fun.apply(this, args);
      emitChange();
    };
  }
}
