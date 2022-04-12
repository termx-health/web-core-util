import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'concat'
})
export class ConcatPipe implements PipeTransform {
  public transform<T>(input: string | T | T[], ...others: (string | T | T[])[]): string | T[] {
    if (!others) {
      if (typeof input === 'string') {
        return input;
      }
      return Array.isArray(input) ? input : [input];
    }

    if (Array.isArray(input)) {
      return [...input, ...others.flat(Infinity)] as T[];
    }
    return [input, ...others.flat(Infinity)].join('');
  }
}
