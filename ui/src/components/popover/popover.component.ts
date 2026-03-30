import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Directive,
  ElementRef,
  Input,
  OnChanges,
  Renderer2,
  TemplateRef,
  ViewContainerRef,
  ViewEncapsulation
} from '@angular/core';
import {MuiTooltipBaseComponent, MuiTooltipBaseDirective, TooltipHorizontalPosition, TooltipVerticalPosition} from '../tooltip/tooltip.base';
import {BooleanInput} from '@termx-health/core-util';
import {NgChanges} from '../core';


@Directive({
  standalone: false,
  selector: '[m-popover], [mPopover]'
})
export class MuiPopoverDirective extends MuiTooltipBaseDirective implements OnChanges {
  public static ngAcceptInputType_mPopover: boolean | string;
  public static ngAcceptInputType_mPlain: boolean | string;
  public static ngAcceptInputType_mHideArrow: boolean | string;

  @Input() public mPopover: boolean = true;
  @Input() public mPopoverClass: string;
  @Input() @BooleanInput() public mPlain: boolean;
  @Input() @BooleanInput() public mHideArrow: boolean;

  @Input() public override mTitle: string | TemplateRef<any>;
  @Input() public override mContent: string | TemplateRef<any>;
  @Input() public override mTitleContext: any;
  @Input() public override mContentContext: any;

  @Input() public override mPosition: string | TooltipHorizontalPosition | TooltipVerticalPosition = 'top';
  @Input() public override mTrigger: string | 'hover' | 'focus' | 'click' = 'hover';

  public override componentRef = this.hostView.createComponent(MuiPopoverComponent);


  public constructor(
    elementRef: ElementRef,
    hostView: ViewContainerRef,
    renderer: Renderer2,
  ) {
    super(elementRef, hostView, renderer);
  }

  public override ngOnChanges(changes: NgChanges<MuiPopoverDirective>): void {
    super.ngOnChanges(changes);
    const {mPopover} = changes;

    if (mPopover) {
      if (this.component && !mPopover.currentValue) {
        this.component.hide();
      }
    }
  }


  protected override proxyComponentInputs(): { [p in keyof MuiPopoverComponent]?: () => any } {
    return {
      mVisible: () => this.mPopover,
      mPopoverClass: () => this.mPopoverClass,
      mPlain: () => this.mPlain,
      mHideArrow: () => this.mHideArrow,
    };
  }
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
        [cdkConnectedOverlayOpen]="mVisible && _visible"
        [cdkConnectedOverlayPush]="true"
        [cdkConnectedOverlayPositions]="_positions"
        (overlayOutsideClick)="onClickOutside($event)"
        (detach)="hide()"
        (positionChange)="onPositionChange($event)"
    >
      <div class="m-popover" [ngClass]="_classes" *ngIf="mVisible && _visible">
        <div class="m-popover-content">
          <div class="m-popover-arrow" *ngIf="!mHideArrow">
            <span class="m-popover-arrow-content"></span>
          </div>

          <div class="m-popover-inner" [ngStyle]="{ padding: mPlain ? undefined : '.5rem 1rem' }">
            <ng-container *ngIf="mTitle">
              <ng-container *stringTemplateOutlet="mTitle, context: mTitleContext">{{mTitle | toString | i18n}}</ng-container>
            </ng-container>

            <ng-container *ngIf="mContent">
              <ng-container *stringTemplateOutlet="mContent, context: mContentContext">{{mContent | toString | i18n}}</ng-container>
            </ng-container>
          </div>
        </div>
      </div>
    </ng-template>
  `
})
export class MuiPopoverComponent extends MuiTooltipBaseComponent {
  public mPlain: boolean;
  public mHideArrow: boolean;
  public mPopoverClass: string;

  public constructor(
    elementRef: ElementRef,
    cdr: ChangeDetectorRef
  ) {
    super(elementRef, cdr);
  }

  public override updateStyle(): void {
    this._classes = {
      [`m-popover-placement-${this._position}`]: true,
      [this.mPopoverClass]: true
    };
  }

  protected override isEmpty(): boolean {
    return MuiPopoverComponent.isValEmpty(this.mTitle)
      && MuiPopoverComponent.isValEmpty(this.mContent);
  }
}
