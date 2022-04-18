import {Pipe, PipeTransform} from '@angular/core';
import {isNil, searchFilterFn, SearchNeedle} from '../../util';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  public transform<T>(values: T[], filter: {[path: string]: SearchNeedle}): T[] {
    if (isNil(values)) {
      return [];
    }
    if (isNil(filter)) {
      return values;
    }
    return values.filter(item => this.filterFn(item, filter));
  }

  protected filterFn<T>(item: T, filter: {[path: string]: SearchNeedle}): boolean {
    return searchFilterFn(item, filter);
  }
}
