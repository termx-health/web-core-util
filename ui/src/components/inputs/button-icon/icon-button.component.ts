import {Component, EventEmitter, Input, Output, ViewEncapsulation} from '@angular/core';
import {NzButtonShape, NzButtonSize} from 'ng-zorro-antd/button';
import {BooleanInput} from '@termx-health/core-util';

@Component({
  standalone: false,
  selector: 'm-icon-button',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'm-icon-button-wrapper'
  },
  template: `
    <m-button mDisplay="text" mShape="circle" [mSize]="mSize" [mLoading]="mLoading" [disabled]="disabled" (mClick)="mClick.emit($event)">
      <m-icon [mCode]="mIcon"></m-icon>
    </m-button>
  `
})
export class MuiIconButtonComponent {
  public static ngAcceptInputType_mLoading: boolean | string;
  public static ngAcceptInputType_disabled: boolean | string;

  @Input() public mIcon: string;
  @Input() public mShape: NzButtonShape;
  @Input() public mSize: NzButtonSize = 'default';
  @Input() @BooleanInput() public mLoading: boolean;
  @Input() @BooleanInput() public disabled: boolean;
  @Output() public mClick = new EventEmitter<MouseEvent>();
}



