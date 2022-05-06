import {Pipe, PipeTransform} from '@angular/core';
import {isNil} from '../../utils';

@Pipe({name: 'filter'})
export class FilterPipe implements PipeTransform {
  public transform<T, A>(values: T[], filter: (f: T, ...arg: A[]) => boolean, ...fnArg: A[]): T[] {
    if (isNil(values)) {
      return [];
    }
    if (isNil(filter)) {
      return values;
    }
    return values.filter(item => filter(item, ...fnArg));
  }
}
