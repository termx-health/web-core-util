import {Pipe} from '@angular/core';
import {SearchPipe} from './search-pipe';

@Pipe({
  name: 'textSearch'
})
export class TextSearchPipe extends SearchPipe {

  protected matchesValue(hay: string, needle: string): boolean {
    return hay && new RegExp(needle, 'i').test(hay);
  }
}
