import {Pipe, PipeTransform} from '@angular/core';
import {isNil} from '../../utils';

@Pipe({name: 'values'})
export class ValuesPipe implements PipeTransform {
  public transform<T>(input: {[s: string]: T} | ArrayLike<T>): T[] {
    if (isNil(input)) {
      return [];
    }
    return Object.values(input);
  }
}

