import {ActivatedRouteSnapshot, DetachedRouteHandle, RouteReuseStrategy} from '@angular/router';

export class AppRouteReuseStrategy implements RouteReuseStrategy {

  handlers: { [key: string]: DetachedRouteHandle } = {};

  public clear(): void {
    this.handlers = {};
  }

  shouldDetach(route: ActivatedRouteSnapshot): boolean {
    return !!route.routeConfig.component && route.data && route.data['routeReusable'];
  }

  store(route: ActivatedRouteSnapshot, handle: DetachedRouteHandle): void {
    const key = this.getKey(route);
    this.handlers[key] = handle;
  }

  shouldAttach(route: ActivatedRouteSnapshot): boolean {
    return !!this.handlers[this.getKey(route)] && route.queryParams['reloadRoute'] === undefined;
  }

  retrieve(route: ActivatedRouteSnapshot): DetachedRouteHandle {
    const key = this.getKey(route);
    return !!this.handlers[key] ? this.handlers[key] : null;
  }

  shouldReuseRoute(future: ActivatedRouteSnapshot, curr: ActivatedRouteSnapshot): boolean {
    return future.routeConfig === curr.routeConfig;
  }

  private getKey(route: ActivatedRouteSnapshot): string {
    return this.getFullPath(route);
  }

  private getFullPath(route: ActivatedRouteSnapshot): string {
    return (route.parent && route.parent.routeConfig ? this.getFullPath(route.parent) + '/' : '') + route.routeConfig.path;
  }
}

