import {Component, Input} from '@angular/core';
import {BooleanInput} from '@termx-health/core-util';

@Component({
  standalone: false,
  selector: 'm-skeleton',
  template: `
    <nz-skeleton [nzLoading]="mLoading | toBoolean" [nzActive]="true">
      <ng-content></ng-content>
    </nz-skeleton>
  `,
  host: {
    class: 'm-skeleton',
    '[class.m-skeleton--loading]': `mLoading`
  }
})
export class MuiSkeletonComponent {
  public static ngAcceptInputType_mLoading: boolean | string;

  @Input() @BooleanInput() public mLoading: boolean = true;
}
