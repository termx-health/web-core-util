import {Component, forwardRef, Input} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BooleanInput} from '@termx-health/core-util';
import {NzTreeNodeOptions} from 'ng-zorro-antd/tree';

export type MuiTreeSelectNodeOptions = NzTreeNodeOptions

@Component({
  standalone: false,
  selector: 'm-tree-select',
  host: {
    class: 'm-tree-select-wrapper'
  },
  template: `
    <m-spinner mSize="small" [mLoading]="loading">
      <nz-tree-select
          class="m-tree-select"
          [nzNodes]="mData"
          [disabled]="disabled | toBoolean"
          [required]="disabled"
          [nzShowSearch]="true"
          [nzPlaceHolder]="placeholder | i18n"
          [nzAllowClear]="allowClear | toBoolean"
          [nzMultiple]="multiple | toBoolean"
          [nzDropdownStyle]="mDropdownStyle"
          [nzHideUnMatched]="mHideUnMatched"
          [name]="name"
          [(ngModel)]="value"
          (ngModelChange)="fireOnChange()"
      ></nz-tree-select>
    </m-spinner>
  `,
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MuiTreeSelectComponent), multi: true}
  ]
})
export class MuiTreeSelectComponent implements ControlValueAccessor {
  public static ngAcceptInputType_loading: boolean | string;
  public static ngAcceptInputType_disabled: boolean | string;
  public static ngAcceptInputType_required: boolean | string;
  public static ngAcceptInputType_allowClear: boolean | string;
  public static ngAcceptInputType_multiple: boolean | string;
  public static ngAcceptInputType_mHideUnMatched: boolean | string;

  @Input() public name: string;
  @Input() public placeholder: string = 'marina.ui.inputs.select.placeholder';

  @Input() @BooleanInput() public loading: boolean;
  @Input() @BooleanInput() public disabled: boolean;
  @Input() @BooleanInput() public required: boolean;
  @Input() @BooleanInput() public allowClear: boolean = true;
  @Input() @BooleanInput() public multiple: boolean;

  @Input() public mData: MuiTreeSelectNodeOptions[];
  @Input() public mDropdownStyle: {[key: string]: string};
  @Input() @BooleanInput() public mHideUnMatched: boolean;

  public value: any;
  public onChange: (_: any) => void = () => undefined;
  public onTouch: (_: any) => void = () => undefined;

  public writeValue(obj: any): void {
    this.value = obj;
  }

  public fireOnChange(): void {
    this.onChange(this.value);
  }

  public registerOnChange(fn: (_: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: (_: string) => void): void {
    this.onTouch = fn;
  }
}
