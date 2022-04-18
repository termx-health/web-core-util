import {Pipe, PipeTransform} from '@angular/core';
import {SearchPipe} from './search.pipe';
import {SearchNeedle, textFilterFn} from '../../utils';

@Pipe({
  name: 'textSearch'
})
export class TextSearchPipe extends SearchPipe implements PipeTransform {
  public filterFn<T>(item: T, filter: {[p: string]: SearchNeedle}): boolean {
    return textFilterFn(item, filter);
  }
}
