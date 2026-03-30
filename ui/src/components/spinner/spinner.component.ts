import {Component, Input} from '@angular/core';
import {BooleanInput} from '@termx-health/core-util';

@Component({
  standalone: false,
  selector: 'm-spinner',
  template: `
    <div class="m-spinner-container" *ngIf="mLoading">
      <div class="m-spinner">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
    <ng-content></ng-content>
  `,
  host: {
    '[class.m-spinner-blur]': `mLoading`,
    '[class.m-spinner-small]': `mSize === 'small'`
  }
})
export class MuiSpinnerComponent {
  public static ngAcceptInputType_mLoading: boolean | string;

  @Input() @BooleanInput() public mLoading: boolean = true;
  @Input() public mSize: string | 'small' | 'large' = 'large';
}
