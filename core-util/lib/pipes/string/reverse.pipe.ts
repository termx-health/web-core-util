import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'reverse'})
export class ReversePipe implements PipeTransform {
  public transform<T>(input: string | T[]): string | T[] {
    if (Array.isArray(input)) {
      return input.reverse();
    }
    return input.split("").reverse().join("");
  }
}
