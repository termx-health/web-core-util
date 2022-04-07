import {Pipe, PipeTransform} from '@angular/core';
import {sort} from '../../util/sort.util';

@Pipe({
  name: 'sort'
})
export class SortPipe implements PipeTransform {

  public transform<T>(array: Array<T>, key: string, direction?: 'ascend' | string): Array<T> {
    direction = direction || 'ascend';
    if (!key || !array) {
      return array;
    }
    return [...sort(array, key, direction === 'ascend')];
  }

}
