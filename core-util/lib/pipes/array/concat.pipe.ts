import {Pipe, PipeTransform} from '@angular/core';
import {flat, isDefined} from '../../utils';

@Pipe({name: 'concat'})
export class ConcatPipe implements PipeTransform {
  public transform<T>(elements: T | T[], ...args: (T | T[])[]): T[] {
    const _args = isDefined(args) ? flat(args) : [];
    if (Array.isArray(elements)) {
      return [...elements, ..._args] as T[];
    }
    return [elements, ..._args] as T[];
  }
}
