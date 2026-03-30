import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {MuiTooltipBaseComponent, MuiTooltipBaseDirective, TooltipHorizontalPosition, TooltipVerticalPosition} from '../tooltip/tooltip.base';
import {findFocusableElement} from '@termx-health/core-util';


@Directive({
  standalone: false,
  selector: '[m-popconfirm], [mPopover]'
})
export class MuiPopconfirmDirective extends MuiTooltipBaseDirective {
  @Input() public mPopconfirmTitle: string | TemplateRef<any>;
  @Input() public mPopconfirmTitleContext: any;
  @Input() public mIcon = 'warning';

  @Input() public mConfirmText = 'marina.ui.popConfirm.yes';
  @Input() public mCancelText = 'marina.ui.popConfirm.no';

  @Output() public mOnConfirm = new EventEmitter<void>();
  @Output() public mOnCancel = new EventEmitter<void>();

  @Input() public override mPosition: string | TooltipHorizontalPosition | TooltipVerticalPosition = 'top';
  public override mTrigger = 'click';

  public componentRef = this.hostView.createComponent(MuiPopconfirmComponent);

  public constructor(
    elementRef: ElementRef,
    hostView: ViewContainerRef,
    renderer: Renderer2,
  ) {
    super(elementRef, hostView, renderer);
  }

  protected override proxyComponentInputs(): { [p in keyof MuiPopconfirmComponent]?: () => any } {
    return {
      mPopconfirmTitle: () => this.mPopconfirmTitle,
      mPopconfirmTitleContext: () => this.mPopconfirmTitleContext,
      mIcon: () => this.mIcon,
      mConfirmText: () => this.mConfirmText,
      mCancelText: () => this.mCancelText,
      mConfirmPress: () => this.onmConfirmPress,
      mCancelPress: () => this.onCancelPress,
    };
  }


  private onmConfirmPress = (): void => {
    this.component.hide();
    this.mOnConfirm.emit();
  };

  private onCancelPress = (): void => {
    this.component.hide();
    this.mOnCancel.emit();
  };
}


@Component({
  standalone: false,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template
        #overlay="cdkConnectedOverlay"
        cdkConnectedOverlay
        [cdkConnectedOverlayOrigin]="_origin"
        [cdkConnectedOverlayOpen]="_visible"
        [cdkConnectedOverlayPush]="true"
        [cdkConnectedOverlayPositions]="_positions"
        (overlayOutsideClick)="onClickOutside($event)"
        (detach)="hide()"
        (positionChange)="onPositionChange($event)"
    >
      <div class="m-popover" [ngClass]="_classes" *ngIf="_visible">
        <div class="m-popover-content">
          <div class="m-popover-arrow">
            <span class="m-popover-arrow-content"></span>
          </div>
          <div class="m-popover-inner m-popconfirm">
            <div class="m-items-middle m-popconfirm-content">
              <ng-container *stringTemplateOutlet="mPopconfirmTitle, context: mPopconfirmTitleContext">
                <m-icon [mCode]="mIcon" *ngIf="mIcon"></m-icon>
                {{mPopconfirmTitle | toString | i18n}}
              </ng-container>
            </div>

            <div class="m-items-middle m-popconfirm-actions">
              <m-button mDisplay="text" mSize="small" (mClick)="mCancelPress()" *ngIf="mCancelText">{{mCancelText | i18n}}</m-button>
              <m-button mDisplay="primary" mSize="small" (mClick)="mConfirmPress()" *ngIf="mConfirmText">{{mConfirmText | i18n}}</m-button>
            </div>
          </div>
        </div>
      </div>
    </ng-template>
  `
})
export class MuiPopconfirmComponent extends MuiTooltipBaseComponent {
  private previouslyFocusedElement: HTMLElement;

  public mPopconfirmTitle: string | TemplateRef<any>;
  public mPopconfirmTitleContext: any;

  public mIcon: string;
  public mConfirmText: string;
  public mCancelText: string;
  public mConfirmPress: () => void;
  public mCancelPress: () => void;

  public constructor(
    elementRef: ElementRef,
    cdr: ChangeDetectorRef
  ) {
    super(elementRef, cdr);
  }

  public override updateStyle(): void {
    this._classes = {
      [`m-popover-placement-${this._position}`]: true
    };
  }

  public override show(): void {
    super.show();
    this.savePreviouslyFocusedElement();
  }

  public override hide(): void {
    super.hide();
    this.restoreFocus();
  }

  protected override isEmpty(): boolean {
    return MuiPopconfirmComponent.isValEmpty(this.mPopconfirmTitle);
  }


  private savePreviouslyFocusedElement(): void {
    this.previouslyFocusedElement = document.activeElement as HTMLElement;
    setTimeout(() => {
      const overlayContent = this.overlay.overlayRef?.overlayElement;
      findFocusableElement(overlayContent)?.focus();
    });
  }

  private restoreFocus(): void {
    const activeElement = document.activeElement;
    const overlayContent = this.overlay.overlayRef?.overlayElement;

    if (
      !activeElement ||
      overlayContent?.contains(activeElement)
    ) {
      this.previouslyFocusedElement.focus();
    }
  }
}
