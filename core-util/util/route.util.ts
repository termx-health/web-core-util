import {ActivatedRouteSnapshot} from '@angular/router';

export function getParamsDeep(route: ActivatedRouteSnapshot): any {
  let params = route.params;
  if (route.children) {
    route.children.forEach(c => params = {...params, ...getParamsDeep(c)});
  }
  return params;
}

