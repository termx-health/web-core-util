import {
  AfterViewInit,
  ChangeDetectorRef,
  ComponentRef,
  Directive,
  ElementRef,
  OnChanges,
  Renderer2,
  TemplateRef,
  ViewChild,
  ViewContainerRef
} from '@angular/core';
import {NgChanges} from '../core';
import {CdkConnectedOverlay, ConnectedOverlayPositionChange, ConnectionPositionPair} from '@angular/cdk/overlay';
import {isNil} from '@termx-health/core-util';

export type TooltipHorizontalPosition = `${'left' | 'right'}${'Top' | 'Bottom' | ''}`
export type TooltipVerticalPosition = `${'top' | 'bottom'}${'Left' | 'Right' | ''}`

const POSITION_MAP: { [key in TooltipHorizontalPosition | TooltipVerticalPosition]: ConnectionPositionPair } = {
  leftTop: new ConnectionPositionPair({originX: 'start', originY: 'top'}, {overlayX: 'end', overlayY: 'top'}),
  left: new ConnectionPositionPair({originX: 'start', originY: 'center'}, {overlayX: 'end', overlayY: 'center'}),
  leftBottom: new ConnectionPositionPair({originX: 'start', originY: 'bottom'}, {overlayX: 'end', overlayY: 'bottom'}),

  rightTop: new ConnectionPositionPair({originX: 'end', originY: 'top'}, {overlayX: 'start', overlayY: 'top'}),
  right: new ConnectionPositionPair({originX: 'end', originY: 'center'}, {overlayX: 'start', overlayY: 'center'}),
  rightBottom: new ConnectionPositionPair({originX: 'end', originY: 'bottom'}, {overlayX: 'start', overlayY: 'bottom'}),

  topLeft: new ConnectionPositionPair({originX: 'start', originY: 'top'}, {overlayX: 'start', overlayY: 'bottom'}),
  top: new ConnectionPositionPair({originX: 'center', originY: 'top'}, {overlayX: 'center', overlayY: 'bottom'}),
  topRight: new ConnectionPositionPair({originX: 'end', originY: 'top'}, {overlayX: 'end', overlayY: 'bottom'}),

  bottomLeft: new ConnectionPositionPair({originX: 'start', originY: 'bottom'}, {overlayX: 'start', overlayY: 'top'}),
  bottom: new ConnectionPositionPair({originX: 'center', originY: 'bottom'}, {overlayX: 'center', overlayY: 'top'}),
  bottomRight: new ConnectionPositionPair({originX: 'end', originY: 'bottom'}, {overlayX: 'end', overlayY: 'top'}),
};

const DEFAULT_OVERLAY_POSITIONS = [
  POSITION_MAP.top,
  POSITION_MAP.bottom,
  POSITION_MAP.bottomRight,
  POSITION_MAP.bottomLeft,
  POSITION_MAP.right,
  POSITION_MAP.rightTop,
  POSITION_MAP.rightBottom,
  POSITION_MAP.left,
  POSITION_MAP.leftTop,
  POSITION_MAP.leftBottom,
  POSITION_MAP.topLeft,
  POSITION_MAP.topRight,
];

interface MuiTooltipBase {
  mTitle: any | null;
  mContent: any | null;
  mTitleContext: any | null;
  mContentContext: any | null;

  mPosition: string | TooltipHorizontalPosition | TooltipVerticalPosition;
  mTrigger: string | 'hover' | 'focus' | 'click';
}


@Directive({ standalone: false })
export abstract class MuiTooltipBaseDirective implements MuiTooltipBase, AfterViewInit, OnChanges {
  public mTitle: any | null = null;
  public mTitleContext: any | null = null;
  public mContent: any | null = null;
  public mContentContext: any | null = null;

  public mPosition: string | TooltipHorizontalPosition | TooltipVerticalPosition = 'top';
  public mTrigger: string | 'hover' | 'focus' | 'click' = 'hover';


  // References the component, that is rendered to user.
  protected abstract componentRef: ComponentRef<MuiTooltipBaseComponent>;

  // Shorthand for componentRef.instance
  protected get component(): MuiTooltipBaseComponent {
    return this.componentRef?.instance;
  };


  protected readonly triggerDisposables: (() => void)[] = [];
  private timer?: number;

  protected constructor(
    public elementRef: ElementRef,
    protected hostView: ViewContainerRef,
    protected renderer: Renderer2
  ) {}


  public ngOnChanges(changes: NgChanges<MuiTooltipBaseDirective>): void {
    const {mPosition, mTrigger} = changes;
    if (mPosition || mTrigger) {
      this.createComponent();
    }

    if (this.component) {
      this.proxyInputs();
    }
  }

  public ngAfterViewInit(): void {
    this.createComponent();
  }


  /* Internal API */

  private createComponent(): void {
    // remove component from DOM, the original component will be displayed in CDK overlay
    this.renderer.removeChild(this.renderer.parentNode(this.elementRef.nativeElement), this.componentRef.location.nativeElement);
    this.component.setOverlayOrigin(this.elementRef);

    this.proxyInputs();
    this.registerTriggers();
  }

  protected abstract proxyComponentInputs(): { [p in keyof MuiTooltipBaseComponent]?: () => any };

  private proxyInputs(): void {
    const pim: { [p in keyof MuiTooltipBaseComponent]?: () => any } = {
      mTitle: (): any => this.mTitle,
      mContent: (): any => this.mContent,
      mTitleContext: (): any => this.mTitleContext,
      mContentContext: (): any => this.mContentContext,
      mPosition: (): any => this.mPosition,
      mTrigger: (): any => this.mTrigger,
      ...this.proxyComponentInputs()
    };

    Object.entries(pim).forEach(([targetProp, getter]) => {
      this.component[targetProp] = getter();
    });
  };


  /* Display triggers */

  private registerTriggers(): void {
    const regTrigger = (el: Element, eventName: string, trigger: (e?: Event) => void): void => {
      this.triggerDisposables.push(this.renderer.listen(el, eventName, trigger));
    };

    const delayed = (f: () => void): void => {
      if (this.timer) {
        clearTimeout(this.timer);
      }
      this.timer = window.setTimeout(() => {
        f();
        this.timer = undefined;
      }, 100);
    };
    const onEnter = (): void => delayed(() => this.component.show());
    const onLeave = (): void => delayed(() => this.component.hide());


    this.disposeTriggers();
    const el = this.elementRef.nativeElement;

    if (this.mTrigger === 'hover') {
      regTrigger(el, 'mouseenter', onEnter);
      regTrigger(el, 'mouseleave', () => {
          onLeave();
          const overlay = this.component.overlay?.overlayRef?.overlayElement;
          if (overlay) {
            regTrigger(overlay, 'mouseenter', onEnter);
            regTrigger(overlay, 'mouseleave', onLeave);
          }
        }
      );
    } else if (this.mTrigger === 'focus') {
      regTrigger(el, 'focusin', () => this.component.show());
      regTrigger(el, 'focusout', () => this.component.hide());
    } else if (this.mTrigger === 'click') {
      regTrigger(el, 'click', (e: MouseEvent) => {
        e.preventDefault();
        this.component.show();
      });
    }
  }

  private disposeTriggers(): void {
    this.triggerDisposables.forEach(dispose => dispose());
    this.triggerDisposables.length = 0;
  }
}


@Directive({ standalone: false })
export abstract class MuiTooltipBaseComponent implements MuiTooltipBase {
  public mVisible: any | null = null;

  public mTitle: any | null = null;
  public mTitleContext: any | null = null;
  public mContent: any | null = null;
  public mContentContext: any | null = null;

  public mTrigger: string | 'hover' | 'focus' | 'click' = 'hover';
  public _position: string | TooltipHorizontalPosition | TooltipVerticalPosition;

  public set mPosition(pos: string | TooltipHorizontalPosition | TooltipVerticalPosition) {
    this._position = pos;
    this._positions = [POSITION_MAP[pos], ...DEFAULT_OVERLAY_POSITIONS].filter(Boolean);
  };


  // cdk overlay options
  @ViewChild('overlay', {static: false}) public overlay!: CdkConnectedOverlay;
  public _origin!: ElementRef;
  public _classes = {};
  public _visible = false;
  public _positions: ConnectionPositionPair[] = [...DEFAULT_OVERLAY_POSITIONS];


  protected constructor(
    public elementRef: ElementRef,
    public cdr: ChangeDetectorRef
  ) { }


  protected abstract updateStyle(): void ;

  protected abstract isEmpty(): boolean ;


  /* API for directive  */

  public setOverlayOrigin(origin: ElementRef<HTMLElement>): void {
    this._origin = origin;
  }


  /* Public API */
  public show(): void {
    if (this._visible || this.isEmpty()) {
      return;
    }

    this._visible = true;
    this.updateStyle();
    this.cdr.markForCheck();
  }

  public hide(): void {
    if (!this._visible) {
      return;
    }

    this._visible = false;
    this.cdr.markForCheck();
  }


  /* Internal API */

  public onPositionChange(position: ConnectedOverlayPositionChange): void {
    this._position = MuiTooltipBaseComponent.getPositionName(position)!;
    this.updateStyle();
    this.cdr.detectChanges();
  }

  public onClickOutside(event: MouseEvent): void {
    if (!this._origin.nativeElement.contains(event.target)) {
      this.hide();
    }
  }


  /* Utils */

  private static getPositionName(position: ConnectedOverlayPositionChange): string | undefined {
    const {originX, originY, overlayX, overlayY} = position.connectionPair;
    for (const placement in POSITION_MAP) {
      if (
        originX === POSITION_MAP[placement].originX &&
        originY === POSITION_MAP[placement].originY &&
        overlayX === POSITION_MAP[placement].overlayX &&
        overlayY === POSITION_MAP[placement].overlayY
      ) {
        return placement;
      }
    }
  }

  public static isValEmpty(v: string | TemplateRef<any>): boolean {
    return v instanceof TemplateRef ? false : v === '' || isNil(v);
  };
}
