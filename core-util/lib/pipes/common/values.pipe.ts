import {Pipe, PipeTransform} from '@angular/core';
import {isNil} from '../../utils';

@Pipe({
  name: 'values'
})
export class ValuesPipe implements PipeTransform {
  public transform<T>(input: {[key: string]: T}): T[] {
    if (isNil(input)) {
      return [];
    }
    return Object.values(input);
  }
}
