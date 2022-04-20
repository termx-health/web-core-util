import {Pipe, PipeTransform} from '@angular/core';
import {isDefined} from '../../utils';

@Pipe({
  name: 'min'
})
export class MinPipe implements PipeTransform {
  public transform(items: number[]): number | undefined {
    if (isDefined(items)) {
      return Math.min(...items);
    }
  }
}
