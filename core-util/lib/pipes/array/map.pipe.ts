import {Pipe, PipeTransform} from '@angular/core';
import {getPathValue, isNil, RecursiveKeyOf} from '../../utils';


@Pipe({name: 'map'})
export class MapPipe implements PipeTransform {
  public transform<T, R>(
    values: T | T[],
    mapper: ((f: T, ...args: any[]) => R | undefined) | RecursiveKeyOf<T> | any,
    ...fnArgs: any[]
  ): R | (R | undefined)[] | undefined {
    if (isNil(values)) {
      return undefined;
    }
    if (isNil(mapper)) {
      return values as unknown as R | R[];
    }

    const mapValue = (item: T): R | undefined => {
      return typeof mapper === 'string'
        ? getPathValue<T, R>(item, mapper)
        : mapper(item, ...fnArgs);
    };

    return Array.isArray(values)
      ? values.map(item => mapValue(item))
      : mapValue(values);
  }
}
