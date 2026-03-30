import {Component, Input} from '@angular/core';
import {BooleanInput} from '@termx-health/core-util';


@Component({
  standalone: false,
  selector: 'm-divider',
  template: `
    <div class="m-divider__text" *ngIf="!mVertical">
      <ng-container *ngTemplateOutlet="header"></ng-container>
    </div>

    <ng-template #header>
      <ng-container *ngIf="mText">
        {{mText | i18n}}
      </ng-container>
      <ng-container *ngIf="!mText">
        <ng-content></ng-content>
      </ng-container>
    </ng-template>
  `,
  host: {
    class: 'm-divider',
    '[class.m-divider--vertical]': `mVertical`,
    '[class.m-divider--left]': `!mVertical && mOrientation === 'left'`,
    '[class.m-divider--right]': `!mVertical && mOrientation === 'right'`,
  }
})
export class MuiDividerComponent {
  public static ngAcceptInputType_mVertical: boolean | string;

  @Input() public mText?: string;
  @Input() @BooleanInput() public mVertical?: boolean;
  @Input() public mOrientation: string | 'left' | 'right' | 'middle' = 'left';
}
