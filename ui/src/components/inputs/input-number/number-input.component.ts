import {Component, ElementRef, EventEmitter, forwardRef, Input, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {findFocusableElement} from '@termx-health/core-util';

@Component({
  standalone: false,
  selector: 'm-number-input',
  host: {
    class: 'm-number-input-wrapper',
    '[attr.name]': 'name'
  },
  templateUrl: './number-input.component.html',
  providers: [{provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MuiNumberInputComponent), multi: true}]
})
export class MuiNumberInputComponent implements ControlValueAccessor {
  @Input() public name: string;
  @Input() public step = 1;
  @Input() public min: number;
  @Input() public max: number;
  @Input() public placeholder: string = '';
  @Input() public disabled: boolean;
  @Input() public selectOnFocus = false;

  @Output() public mChange = new EventEmitter<number>();

  public val: number;
  public onChange = (x: any): void => x;

  public constructor(private elementRef: ElementRef) {}

  public writeValue(obj: any): void {
    this.val = obj === '' ? null : obj;
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(_fn: any): void {
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public fireOnChange(fn: any): void {
    fn = fn === '' ? null : fn;
    this.onChange(fn);
    this.mChange.emit(fn);
  }

  public onKeydown(event: KeyboardEvent, el): void {
    if (event.key === ',') {
      event.stopPropagation();
      const input = el.elementRef.nativeElement.querySelector('input');
      input.value += '.';
    }
  }

  public focus(): void {
    findFocusableElement(this.elementRef.nativeElement).focus();
  }
}



