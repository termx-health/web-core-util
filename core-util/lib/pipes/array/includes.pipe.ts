import {Pipe, PipeTransform} from '@angular/core';

@Pipe({name: 'includes'})
export class IncludesPipe implements PipeTransform {
  public transform<T>(input: T[], value: T): boolean {
    return input?.includes(value);
  }
}
