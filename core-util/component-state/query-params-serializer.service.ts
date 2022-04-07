import {Injectable, Type} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {getDeclaredTypeName} from '../util/type.util';

@Injectable({ providedIn: 'root' })
export class QueryParamsSerializerService {

  constructor(
    private router: Router
  ) {}

  public load<T extends object>(route: ActivatedRoute, type: Type<T>, params: T): void {
    route.snapshot.queryParamMap.keys.forEach(pKey => {
      const pValue = route.snapshot.queryParamMap.get(pKey);
      if (pValue !== undefined && pValue !== null) {
        const typeName: string = getDeclaredTypeName(type, pKey);
        if (typeName === 'Number') {
          params[pKey] = Number(pValue);
        } else if (typeName === 'Array') {
          params[pKey] = route.snapshot.queryParamMap.getAll(pKey).map(v => v.split(','));
        } else if (typeName === 'Date') {
          params[pKey] = new Date(pValue);
        } else if (typeName === 'Boolean') {
          params[pKey] = 'true' === pValue;
        } else {
          params[pKey] = pValue;
        }
      }
    });
  }

  public store<T extends object>(route: ActivatedRoute, params: T, defaultValues?: Partial<T>): void {
    this.router.navigate(['.'], {
      queryParams: this.toRouteQueryParams(params, defaultValues),
      relativeTo: route,
      replaceUrl: true
    });
  }

  private toRouteQueryParams(object: object, defaultValues?: object): object {
    const result = {};
    Object.entries(object).forEach(e => {
      if (e[1] === undefined || e[1] === null || e[1] === '' || (e[1] instanceof Array && e[1].length === 0)) {
        // ignore null values, undefined, empty strings and empty arrays
      } else if (defaultValues !== undefined && defaultValues[e[0]] !== undefined) {
        if (defaultValues[e[0]] !== e[1]) {
          result[e[0]] = e[1];
        }
      } else if (e[1] instanceof Date) {
        result[e[0]] = (e[1] as Date).toISOString();
      } else {
        result[e[0]] = e[1];
      }
    });
    return result;
  }
}
