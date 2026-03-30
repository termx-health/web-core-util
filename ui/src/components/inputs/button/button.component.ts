import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {NzButtonShape, NzButtonSize, NzButtonType} from 'ng-zorro-antd/button';
import {BooleanInput} from '@termx-health/core-util';

@Component({
  standalone: false,
  selector: 'm-button',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'm-button-wrapper',
    '[class.m-button-loading]': `mLoading`
  },
  template: `
    <button class="m-button"
        nz-button
        [style]="mStyle"
        [class]="mClass"
        [type]="type"
        [nzType]="mDisplay"
        [nzShape]="mShape"
        [nzSize]="mSize"
        [disabled]="disabled | toBoolean"
        [nzLoading]="mLoading | toBoolean"
        (click)="!disabled ? mClick.emit($event): null"
    >
      <ng-container *ngIf="mLabel">
        {{mLabel | i18n}}
      </ng-container>
      <ng-container *ngIf="!mLabel">
        <ng-content></ng-content>
      </ng-container>
    </button>
  `
})
export class MuiButtonComponent {
  public static ngAcceptInputType_mLoading: boolean | string;
  public static ngAcceptInputType_disabled: boolean | string;

  @Input() public type: string = 'button';
  @Input() public mLabel?: string;
  @Input() public mDisplay: NzButtonType = 'default';
  @Input() public mShape: NzButtonShape = null;
  @Input() public mSize: NzButtonSize = 'default';
  @Input() @BooleanInput() public mLoading: boolean;
  @Input() @BooleanInput() public disabled: boolean;

  @Input() public mStyle?: string;
  @Input() public mClass?: string;
  @Output() public mClick = new EventEmitter<MouseEvent>();
}



