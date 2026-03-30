import {Component, Input, Optional, TemplateRef, ViewChild} from '@angular/core';
import {BooleanInput} from '@termx-health/core-util';
import {NzFormStatusService} from 'ng-zorro-antd/core/form';
import {MuiFormControlComponent} from './form-control.component';

@Component({
  standalone: false,
  selector: 'm-form-item',
  template: `
    <nz-form-item [ngStyle]="mStyle">
      <nz-form-label *ngIf="mLabel || mLabelHint" [ngStyle]="mLabelStyle" [nzSpan]="mLabelSpan" [nzFor]="mName" [nzRequired]="required | toBoolean" nzNoColon>
        <ng-container *stringTemplateOutlet="mLabel, context: mLabelContext">
          {{mLabel | toString | i18n}}
        </ng-container>

        <m-icon
            *ngIf="mLabelHint"
            mCode="question-circle"
            style="margin-left: .25rem"
            m-tooltip [mTitle]="mLabelHint" [mTitleContext]="mLabelContext"
        ></m-icon>
      </nz-form-label>

      <m-form-control #formControl nz-col [nzSpan]="mControlSpan" [mName]="mName" [mShowExplain]="mShowExplain">
        <ng-content></ng-content>
      </m-form-control>
    </nz-form-item>
  `,
  providers: [NzFormStatusService]
})
export class MuiFormItemComponent {
  public static ngAcceptInputType_required: boolean | string;

  @Input() public mName: string;

  @Input() public mLabel: string | TemplateRef<any>;
  @Input() public mLabelContext: any;
  @Input() public mLabelHint: string | TemplateRef<any>;
  @Input() public mLabelHintContext: any;

  @Input() public mShowExplain: boolean = true;
  @Input() public mLabelSpan: number = 24;
  @Input() public mControlSpan: number = 24;

  @Input() public mStyle: any;
  @Input() public mLabelStyle: any;

  @Input() @BooleanInput() public required: boolean;

  @ViewChild('formControl')
  public set formControl(mfc: MuiFormControlComponent) {
    // fixme: see form-control's comment
    mfc.nzFormStatusService = this.nzFormStatusService;
  }

  public constructor(@Optional() public nzFormStatusService?: NzFormStatusService) { }
}
