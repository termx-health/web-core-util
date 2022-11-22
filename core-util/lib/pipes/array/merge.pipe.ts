import {Pipe, PipeTransform} from '@angular/core';
import {getPathValue, isNil, uniqueBy} from '../../utils';

@Pipe({name: 'merge'})
export class MergePipe implements PipeTransform {
  public transform<T>(target: T[], source: T[], fn: string | ((x: T) => any)): T[] | undefined {
    if (isNil(target)) {
      target = [];
    }
    if (!source?.length) {
      return target;
    }
    return uniqueBy(
      [...target.filter(Boolean), ...source.filter(Boolean)],
      el => typeof fn === 'string' ? getPathValue(el, fn) : fn(el)
    );
  }
}


