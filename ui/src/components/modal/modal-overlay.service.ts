import {Injectable, Injector} from '@angular/core';
import {ComponentType, Overlay, OverlayRef} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';

let globalCounter = 0;

@Injectable()
export class MuiModalOverlayService {
  public constructor(
    private overlay: Overlay,
    private injector: Injector
  ) {}


  public getGlobalId(componentPrefix: string): string {
    return `${componentPrefix}-${globalCounter++}`;
  }

  public withContainer<T extends {overlayRef: OverlayRef}>(ctor: ComponentType<T>): T {
    const overlayRef = this.overlay.create({
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.block(),
      positionStrategy: this.overlay.position().global(),
    });


    const componentPortal = new ComponentPortal(ctor, null, this.injector);
    const componentRef = overlayRef.attach(componentPortal);
    componentRef.instance.overlayRef = overlayRef;

    const overlayPane = overlayRef.overlayElement;
    overlayPane.style.zIndex = '1000';

    return componentRef.instance;
  }
}

