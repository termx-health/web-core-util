import {Pipe, PipeTransform} from '@angular/core';
import {isNil} from '../../utils';

@Pipe({
  name: 'max'
})
export class MaxPipe implements PipeTransform {
  public transform(items: number[]): number {
    if (isNil(items)) {
      return null;
    }
    return Math.max(...items);
  }
}
