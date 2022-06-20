import {Pipe, PipeTransform} from '@angular/core';
import {isDefined} from '../../utils';

@Pipe({name: 'last'})
export class LastPipe implements PipeTransform {
  public transform<T>(values: T[]): T | undefined {
    return isDefined(values) ? values[values.length - 1] : undefined;
  }
}
