import {Pipe, PipeTransform} from '@angular/core';
import {isNil} from '../../utils';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  public transform<T, A>(values: Array<T>, filter: (f: T, arg: A) => boolean, fnArg?: A): Array<T> {
    if (isNil(filter)) {
      return values;
    }
    if (isNil(values)) {
      return [];
    }
    return values.filter(item => filter(item, fnArg));
  }
}
