import {Component, EventEmitter, Input, OnDestroy, Output, ViewChild} from '@angular/core';
import {BooleanInput, findFocusableElement} from '@termx-health/core-util';
import {NzDrawerComponent} from 'ng-zorro-antd/drawer';
import {HistoryStateManager} from '../core/history-state-manager';

export  type MuiDrawerPlacement = 'left' | 'right';


@Component({
  standalone: false,
  selector: 'm-drawer',
  template: `
    <nz-drawer #nzDrawer
        nzWrapClassName="m-drawer-body"
        [nzPlacement]="mPlacement"
        [nzWidth]="mWidth"
        [nzVisible]="mVisible | toBoolean"
        (nzVisibleChange)="onVisibleChange($event)"
        [nzClosable]="false"
        [nzMaskClosable]="mMaskClosable | toBoolean"
        [nzMask]="mMask | toBoolean"
        (nzOnClose)="onClose()"
        [nzCloseOnNavigation]="false"
    >
      <div *nzDrawerContent cdkTrapFocus tabindex="-1">
        <ng-content></ng-content>
      </div>
    </nz-drawer>
  `,
  host: {
    class: 'm-drawer',
    '(window:popstate)': 'dismissDrawer()'
  }
})
export class MuiDrawerComponent implements OnDestroy {
  private historyManager = new HistoryStateManager();

  public static ngAcceptInputType_mVisible: boolean | string;
  public static ngAcceptInputType_mMask: boolean | string;
  public static ngAcceptInputType_mMaskClosable: boolean | string;

  @Input() public mPlacement: MuiDrawerPlacement = 'left';
  @Input() public mWidth: number | string = 550;
  @Input() @BooleanInput() public mVisible: boolean;
  @Input() @BooleanInput() public mMask: boolean = true;
  @Input() @BooleanInput() public mMaskClosable: boolean = true;

  @Output() public mVisibleChange = new EventEmitter<boolean>();
  @Output() public mClose = new EventEmitter<void>();

  @ViewChild(NzDrawerComponent) private nzDrawer: NzDrawerComponent;


  public ngOnDestroy(): void {
    if (this.mVisible) {
      this.historyManager.resetState();
    }
  }


  /* Public API */

  public open(): void {
    this.nzDrawer?.open();
  }

  public close(): void {
    this.nzDrawer?.close();
    this.onClose();
  }


  /* Internal API */

  protected onClose(): void {
    this.mClose.emit();
    this.historyManager.resetState();
  }

  protected onVisibleChange(visible: boolean): void {
    this.mVisibleChange.emit(visible);

    if (visible) {
      this.historyManager.pushState();
      setTimeout(() => {
        const overlayContent = this.nzDrawer.overlayRef.overlayElement.querySelector('div[cdktrapfocus]');
        const el = findFocusableElement(overlayContent);
        el?.focus();
      });
    }
  }

  protected dismissDrawer(): void {
    if (this.mVisible && this.historyManager.isPrevious) {
      this.close();
    }
  }
}
