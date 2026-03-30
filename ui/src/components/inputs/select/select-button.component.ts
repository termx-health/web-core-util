import {Component, EventEmitter, Input, Output, TemplateRef} from '@angular/core';
import {BooleanInput} from '@termx-health/core-util';

@Component({
  standalone: false,
  selector: 'm-select-button',
  template: ''
})
export class MuiSelectButtonComponent {
  public static ngAcceptInputType_mReopenOnClick: boolean | string;

  @Input() public mLabel?: string | TemplateRef<any>;
  @Input() public mHotkey?: string;
  @Input() @BooleanInput() public mReopenOnClick: boolean;
  @Output() public mClick = new EventEmitter<string>();
}
