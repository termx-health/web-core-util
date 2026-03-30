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
import {MuiTooltipBaseComponent, MuiTooltipBaseDirective, TooltipHorizontalPosition, TooltipVerticalPosition} from './tooltip.base';
import {NgChanges} from '../core';


@Directive({
  standalone: false,
  selector: '[m-tooltip], [mTooltip]'
})
export class MuiTooltipDirective extends MuiTooltipBaseDirective implements OnChanges {
  public static ngAcceptInputType_mTooltip: boolean | string;

  @Input() public mTooltip: boolean = true;
  @Input() public mTooltipClass: string;

  @Input() public override mTitle: string | TemplateRef<any>;
  @Input() public override mTitleContext: any;
  @Input() public override mPosition: string | TooltipHorizontalPosition | TooltipVerticalPosition = 'top';
  @Input() public override mTrigger: string | 'hover' | 'focus' | 'click' = 'hover';

  public override componentRef = this.hostView.createComponent(MuiTooltipComponent);


  public constructor(
    elementRef: ElementRef,
    hostView: ViewContainerRef,
    renderer: Renderer2,
  ) {
    super(elementRef, hostView, renderer);
  }


  public override ngOnChanges(changes: NgChanges<MuiTooltipDirective>): void {
    super.ngOnChanges(changes);
    const {mTooltip} = changes;

    if (mTooltip) {
      if (this.component && !mTooltip.currentValue) {
        this.component.hide();
      }
    }
  }

  protected override proxyComponentInputs(): { [p in keyof MuiTooltipComponent]?: () => any } {
    return {
      mVisible: () => this.mTooltip,
      mTooltipClass: () => this.mTooltipClass,
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
        [cdkConnectedOverlayOpen]="_visible"
        [cdkConnectedOverlayPositions]="_positions"
        [cdkConnectedOverlayPush]="true"
        (overlayOutsideClick)="onClickOutside($event)"
        (detach)="hide()"
        (positionChange)="onPositionChange($event)"
    >
      <div class="m-tooltip" [ngClass]="_classes" *ngIf="mVisible && _visible">
        <div class="m-tooltip-content">
          <div class="m-tooltip-arrow">
            <span class="m-tooltip-arrow-content"></span>
          </div>
          <div class="m-tooltip-inner m-whitespace">
            <ng-container *stringTemplateOutlet="mTitle, context: mTitleContext">{{ mTitle | toString | i18n }}</ng-container>
          </div>
        </div>
      </div>
    </ng-template>
  `
})
export class MuiTooltipComponent extends MuiTooltipBaseComponent {
  public mTooltipClass: string;

  public constructor(
    elementRef: ElementRef,
    cdr: ChangeDetectorRef
  ) {
    super(elementRef, cdr);
  }

  public override updateStyle(): void {
    this._classes = {
      [`m-tooltip-placement-${this._position}`]: true,
      [this.mTooltipClass]: true
    };
  }

  protected override isEmpty(): boolean {
    return MuiTooltipComponent.isValEmpty(this.mTitle);
  }
}
