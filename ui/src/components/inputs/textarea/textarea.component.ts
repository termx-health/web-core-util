import {Component, EventEmitter, forwardRef, Input, Output, ViewEncapsulation} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {AutoSizeType} from 'ng-zorro-antd/input';

@Component({
  standalone: false,
  selector: 'm-textarea',
  templateUrl: './textarea.component.html',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'm-textarea-wrapper',
    '[attr.name]': 'name'
  },
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MuiTextareaComponent), multi: true}
  ]
})
export class MuiTextareaComponent implements ControlValueAccessor {
  @Input() public name: string;
  @Input() public disabled: boolean;
  @Input() public placeholder: string = '';
  @Input() public autosize: string | boolean | AutoSizeType;
  @Input() public rows: number;

  @Output() public mChange = new EventEmitter<string>();

  public value = '';
  public onChange = (x: any): any => x;

  public writeValue(obj: string): void {
    this.value = obj || '';
  }

  public fireOnChange(): void {
    this.onChange(this.value);
    this.mChange.emit(this.value);
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(_fn: any): void {
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

}
