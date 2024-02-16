import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'includes'})
export class IncludesPipe implements PipeTransform {
  public transform<T extends unknown[]>(input: T, value: T[number]): boolean {
    return input?.includes(value);
  }
}
