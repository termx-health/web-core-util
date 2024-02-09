import {Pipe, PipeTransform} from '@angular/core';
import {toString} from '../../utils';

@Pipe({name: 'toString'})
export class ToStringPipe implements PipeTransform {
  public transform(value: object | number | string): string | undefined {
    return toString(value);
  }
}
