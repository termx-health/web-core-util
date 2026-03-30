import {Component, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BooleanInput, Range} from '@termx-health/core-util';

class NumberRange extends Range<number> {
}

@Component({
  standalone: false,
  selector: 'm-number-range-input',
  host: {
    class: 'm-number-range-input',
    '[attr.name]': 'name'
  },
  templateUrl: './number-range-input.component.html',
  providers: [{provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MuiNumberRangeInputComponent), multi: true}],
})
export class MuiNumberRangeInputComponent implements ControlValueAccessor {
  public static ngAcceptInputType_disabled: boolean | string;

  @Input() public step = 1;
  @Input() public name: string;
  @Input() @BooleanInput() public disabled: boolean;
  @Output() public mChange = new EventEmitter<NumberRange>();

  public val: NumberRange = new NumberRange();
  public onChange = (x: any): void => x;
  public onTouched = (x: any): void => x;

  public fireOnChange(): void {
    let val = Object.assign({}, this.val);
    if (!val.lower && !val.upper) {
      val = null;
    }
    this.onChange(val);
    this.mChange.emit(val);
  }

  public writeValue(obj: NumberRange): void {
    this.val = obj || new NumberRange();
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}



