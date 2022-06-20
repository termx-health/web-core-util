import {Pipe, PipeTransform} from '@angular/core';
import {isDefined} from '../../utils';

@Pipe({name: 'first'})
export class FirstPipe implements PipeTransform {
  public transform<T>(values: T[]): T | undefined {
    return isDefined(values) ? values[0] : undefined;
  }
}
