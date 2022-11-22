import {Pipe, PipeTransform} from '@angular/core';
import {flat, isDefined} from '../../utils';

@Pipe({name: 'concat'})
export class ConcatPipe implements PipeTransform {
  public transform<T>(elements: T | T[], ...args: (T | T[])[]): T[] {
    const _args = isDefined(args) ? flat(args) as T[] : [];
    return Array.isArray(elements) ? [...elements, ..._args] : [elements, ..._args];
  }
}
