import {Component, EventEmitter, forwardRef, Input, OnChanges, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BooleanInput, toBoolean} from '@termx-health/core-util';
import {NgChanges} from '../../core';

@Component({
  standalone: false,
  selector: 'm-checkbox',
  template: `
    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>

    <label *ngIf="!readOnly" nz-checkbox [(ngModel)]="value" (ngModelChange)="fireOnChange()" [nzDisabled]="disabled | toBoolean">
      <ng-template [ngTemplateOutlet]="content"></ng-template>
    </label>

    <ng-container *ngIf="readOnly">
      <m-icon mCode="border" *ngIf="!value"></m-icon>
      <m-icon mCode="check-square" *ngIf="value"></m-icon>
      <ng-template [ngTemplateOutlet]="content"></ng-template>
    </ng-container>
  `,
  host: {
    class: 'm-checkbox',
    '[attr.name]': 'name'
  },
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MuiCheckboxComponent), multi: true}
  ]
})
export class MuiCheckboxComponent implements ControlValueAccessor, OnChanges {
  public static ngAcceptInputType_mChecked: boolean | string;
  public static ngAcceptInputType_readOnly: boolean | string;
  public static ngAcceptInputType_disabled: boolean | string;

  @Input() public name: string;
  @Input() @BooleanInput() public mChecked: boolean;
  @Input() @BooleanInput() public readOnly: boolean;
  @Input() @BooleanInput() public disabled: boolean;
  @Output() public mCheckedChange = new EventEmitter<boolean>();

  public value: boolean;
  public onChange: (_: boolean) => void = () => undefined;
  public onTouch: (_: boolean) => void = () => undefined;

  public ngOnChanges(changes: NgChanges<MuiCheckboxComponent>): void {
    const {mChecked} = changes;
    if (mChecked) {
      this.writeValue(toBoolean(this.mChecked));
    }
  }

  public writeValue(obj: boolean): void {
    this.value = !!obj;
  }

  public fireOnChange(): void {
    this.onChange(this.value);
    this.mCheckedChange.emit(this.value);
  }

  public registerOnChange(fn: (_: boolean) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: (_: boolean) => void): void {
    this.onTouch = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

}
