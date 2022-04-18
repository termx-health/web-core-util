import {Pipe, PipeTransform} from '@angular/core';
import {isNil} from '../../utils';

@Pipe({
  name: 'min'
})
export class MinPipe implements PipeTransform {
  public transform(items: number[]): number {
    if (isNil(items)) {
      return null;
    }
    return Math.min(...items);
  }
}
