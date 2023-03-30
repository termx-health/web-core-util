import {Pipe, PipeTransform} from '@angular/core';
import {isNil, sort} from '../../utils';

@Pipe({name: 'sort'})
export class SortPipe implements PipeTransform {
  public transform<T>(array: T[], key: string | undefined, direction?: 'ascend' | 'descend' | string): T[] {
    direction = direction || 'ascend';
    if (isNil(key) || isNil(array)) {
      return array;
    }
    return [...sort(array, key, direction === 'ascend')];
  }
}
