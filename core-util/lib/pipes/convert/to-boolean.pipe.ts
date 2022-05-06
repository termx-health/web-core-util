import {Pipe, PipeTransform} from '@angular/core';
import {toBoolean} from '../../utils';

@Pipe({name: 'toBoolean'})
export class ToBooleanPipe implements PipeTransform {
  public transform(value: boolean | string): boolean {
    return toBoolean(value);
  }
}
