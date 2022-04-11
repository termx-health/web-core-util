import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'concat'
})
export class ConcatPipe implements PipeTransform {
  public transform<T>(input: string | T[], ...others: (string | T[])[]): string | T[] {
    if (!others) {
      return input;
    }
    if (Array.isArray(input)) {
      return [...input, ...others.flat(1)] as T[];
    }
    return [input, ...others].join('');
  }
}
