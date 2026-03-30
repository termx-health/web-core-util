import {Component, DestroyRef, ElementRef, forwardRef, Input, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator} from '@angular/forms';
import {startWith} from 'rxjs';
import {
  BooleanInput,
  CoreI18nService,
  endOf,
  findFocusableElement,
  format,
  getLocale,
  getTimeFormat,
  isValid,
  mergeDateTime,
  parse,
  startOf
} from '@termx-health/core-util';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  standalone: false,
  selector: 'm-time-picker',
  templateUrl: 'time-picker.component.html',
  host: {
    class: 'm-time-picker',
    '[attr.name]': 'name'
  },
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MuiTimePickerComponent), multi: true},
    {provide: NG_VALIDATORS, useExisting: forwardRef(() => MuiTimePickerComponent), multi: true}
  ]
})
export class MuiTimePickerComponent implements OnInit, ControlValueAccessor, Validator {
  public static ngAcceptInputType_disabled: boolean | string;

  @Input() public name: string;
  @Input() @BooleanInput() public disabled: boolean;

  private dateFormat: string;
  protected placeholder: string = 'marina.ui.inputs.timePicker.placeholder';

  @ViewChild('textInput') public textInput: ElementRef<HTMLInputElement>;
  protected value = '';
  protected mask: RegExp[];
  private date: Date = new Date();

  private onChange: (x: Date) => void;

  // private onTouch: () => void;

  public constructor(
    private i18nService: CoreI18nService,
    public elementRef: ElementRef,
    private destroyRef: DestroyRef
  ) {}

  public ngOnInit(): void {
    this.i18nService.localeChange.pipe(
      takeUntilDestroyed(this.destroyRef),
      startWith(getLocale())
    ).subscribe(() => {
      this.dateFormat = this.getTimeFormat();
      this.mask = this.formatToMask(this.dateFormat);
      this.value = isValid(this.date) ? format(this.date, this.dateFormat) : '';
      this.placeholder = this.dateFormat.replace(/[a-zA-Z]/g, '_');
    });
  }

  public focus(): void {
    window.setTimeout(() => findFocusableElement(this.textInput.nativeElement)?.focus());
  }


  /* CVA */

  public writeValue(obj: Date | string): void {
    if (!obj) {
      this.value = '';
      this.date = undefined;
      return;
    }
    const d = new Date(obj);
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

  protected valueChange(): void {
    if (!this.value || !this.value.includes('_')) {
      this.fireOnChange();
    }
  }

  protected fireOnChange(): void {
    if (!this.disabled) {
      const d = parse(this.value, this.dateFormat);
      const date = isValid(d) ? mergeDateTime(this.date || new Date(), d) : undefined;
      this.onChange(date);
    }
  }


  /* Validation */

  public validate(control: AbstractControl): ValidationErrors | null {
    const validator = control.validator?.({} as AbstractControl);
    if (validator?.['required'] && !control.value) {
      return {required: true};
    }
    const date = parse(this.value, this.dateFormat);
    return isValid(date) ? null : {invalid: true};
  }


  /* Mask */

  private formatToMask(format: string): RegExp[] {
    const masks = {
      'h': [/[0-9]/, /[0-9]/],
      'm': [/[0-9]/, /[0-9]/],
      's': [/[0-9]/, /[0-9]/],
      'a': [/[AaPp]/, /[Mm]/],
    };
    const tokens = format
      .replace('HH', 'h')
      .replace('hh', 'h')
      .replace('mm', 'm')
      .replace('ss', 's')
      .split('');
    return tokens.map(t => masks[t] || [t]).reduce((a, b) => [...a, ...b], []);
  }

  /**
   * ACHTUNG: supports formats containing 'd', 'M' and 'y' token.
   */
  private getTimeFormat(): string {
    let format = getTimeFormat();
    const hourTokenCnt = format.match(/h/g)?.length;

    if (hourTokenCnt && hourTokenCnt != 2) {
      format = format.replace('h'.repeat(hourTokenCnt), 'hh');
    }
    return format;
  }


  /* Key events */

  protected keyEvent(event: KeyboardEvent): void {
    if (this.disabled) {
      return;
    }
    const code = event.code;
    if (['KeyN', 'KeyE', 'KeyS'].includes(code)) {
      if (code === 'KeyN') {
        this.value = format(new Date(), this.dateFormat);
      } else if (code === 'KeyE') {
        this.value = format(endOf(new Date(), 'days'), this.dateFormat);
      } else if (code === 'KeyS') {
        this.value = format(startOf(new Date(), 'days'), this.dateFormat);
      }
      this.date = mergeDateTime(this.date || new Date(), parse(this.value, this.dateFormat));
    }
  }
}



