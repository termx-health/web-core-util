import {Injectable, Injector} from '@angular/core';
import {ComponentType, Overlay} from '@angular/cdk/overlay';
import {ComponentPortal} from '@angular/cdk/portal';

let globalCounter = 0;

@Injectable()
export class MuiNotificationOverlayService {
  private containers = {};

  public constructor(
    private overlay: Overlay,
    private injector: Injector
  ) {}


  public getGlobalId(componentPrefix: string): string {
    return `${componentPrefix}-${globalCounter++}`;
  }

  public withContainer<T>(componentPrefix: string, ctor: ComponentType<T>): T {
    const containerInstance = this.containers[componentPrefix];
    if (containerInstance) {
      return containerInstance as T;
    }

    const overlayRef = this.overlay.create({
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.noop(),
      positionStrategy: this.overlay.position().global()
    });

    const componentPortal = new ComponentPortal(ctor, null, this.injector);
    const componentRef = overlayRef.attach(componentPortal);

    return this.containers[componentPrefix] = componentRef.instance;
  }
}

