import {Component, EventEmitter, Input, Output, TemplateRef, ViewEncapsulation} from '@angular/core';
import {BooleanInput} from '@termx-health/core-util';


export type MuiAlertType = string | 'success' | 'info' | 'warning' | 'error';

@Component({
  standalone: false,
  selector: 'm-alert',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="m-alert__icon" *ngIf="mShowIcon">
      <m-icon [mCode]="iconMap[mType]"></m-icon>
    </div>

    <div class="m-alert__content">
      <!-- Title -->
      <ng-container *ngIf="mTitle">
        <div *stringTemplateOutlet="mTitle, context: mTitleContext" class="m-alert__title">{{mTitle | toString | i18n}}</div>
      </ng-container>

      <!-- Description & content -->
      <ng-container *ngIf="mDescription">
        <div *stringTemplateOutlet="mDescription, context: mDescriptionContext" class="m-alert__description">{{mDescription | toString | i18n}}</div>
      </ng-container>
      <ng-container *ngIf="!mDescription">
        <ng-content></ng-content>
      </ng-container>
    </div>

    <div class="m-alert__actions" *ngIf="mClosable">
      <m-button class="m-alert__actions-close" mDisplay="text" mShape="circle" mSize="small" (mClick)="close()">
        <m-icon mCode="close"></m-icon>
      </m-button>
    </div>
  `,
  host: {
    class: 'm-alert',
    '[class.m-alert--success]': `mType === 'success'`,
    '[class.m-alert--info]': `mType === 'info'`,
    '[class.m-alert--warning]': `mType === 'warning'`,
    '[class.m-alert--error]': `mType === 'error'`
  }
})
export class MuiAlertComponent {
  public static ngAcceptInputType_mShowIcon: boolean | string;
  public static ngAcceptInputType_mClosable: boolean | string;

  @Input() public mTitle: string | TemplateRef<any>;
  @Input() public mTitleContext: any;
  @Input() public mDescription: string | TemplateRef<any>;
  @Input() public mDescriptionContext: any;

  @Input() public mType: string | MuiAlertType;
  @Input() @BooleanInput() public mShowIcon: boolean;
  @Input() @BooleanInput() public mClosable: boolean;
  @Output() public mClose = new EventEmitter<void>();

  public iconMap: { [type in MuiAlertType]: string } = {
    'success': 'check-circle',
    'info': 'info-circle',
    'warning': 'warning',
    'error': 'close-circle'
  };

  public close(): void {
    if (this.mClose.observed) {
      this.mClose.emit();
    }
  }
}
