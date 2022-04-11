import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {
  public transform<T, A>(values: Array<T>, filter: (f: T, arg: A) => boolean, fnArg?: A): Array<T> {
    if (!filter) {
      return values;
    }
    if (!values) {
      return [];
    }
    return values.filter((item) => {
      return filter(item, fnArg);
    });
  }
}
