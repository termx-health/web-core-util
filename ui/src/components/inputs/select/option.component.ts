import {Component, Input, TemplateRef} from '@angular/core';
import {BooleanInput} from '@termx-health/core-util';

@Component({
  standalone: false,
  selector: 'm-option',
  template: ''
})
export class MuiOptionComponent<T> {
  public static ngAcceptInputType_disabled: boolean | string;

  @Input() public mLabel?: string;
  @Input() public mLabelTemplate?: TemplateRef<any>;
  @Input() public mValue!: T;
  @Input() public mOptions!: any;
  @Input() @BooleanInput() public disabled?: boolean;
}
