import {Component, EventEmitter, forwardRef, Input, Output, ViewEncapsulation} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BooleanInput} from '@termx-health/core-util';

@Component({
  standalone: false,
  selector: 'm-input',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'm-input-wrapper'
  },
  template: `
    <input
        class="m-input"
        nz-input
        m-input
        [attr.name]="name"
        [type]="type"
        [(ngModel)]="value"
        (ngModelChange)="fireOnChange()"
        [placeholder]="placeholder | i18n"
        [disabled]="disabled | toBoolean"
        [readOnly]="readOnly"
    />
  `,
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MuiInputComponent), multi: true}
  ]
})
export class MuiInputComponent implements ControlValueAccessor {
  public static ngAcceptInputType_disabled: boolean | string;
  public static ngAcceptInputType_required: boolean | string;

  @Input() public name: string;
  @Input() public type: string = 'text';
  @Input() public placeholder: string = '';
  @Input() @BooleanInput() public disabled: boolean;
  @Input() @BooleanInput() public readOnly: boolean;

  @Output() public mChange = new EventEmitter<string>();

  public value: string = '';
  public onChange: (_: string) => void = () => undefined;
  public onTouch: (_: string) => void = () => undefined;

  public writeValue(obj: string): void {
    this.value = obj || '';
  }

  public fireOnChange(): void {
    this.onChange(this.value);
    this.mChange.emit(this.value);
  }

  public registerOnChange(fn: (_: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: (_: string) => void): void {
    this.onTouch = fn;
  }

  public setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }
}
