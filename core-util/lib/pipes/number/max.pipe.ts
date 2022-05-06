import {Pipe, PipeTransform} from '@angular/core';
import {isDefined} from '../../utils';

@Pipe({name: 'max'})
export class MaxPipe implements PipeTransform {
  public transform(items: number[]): number | undefined {
    if (isDefined(items)) {
      return Math.max(...items);
    }
  }
}
