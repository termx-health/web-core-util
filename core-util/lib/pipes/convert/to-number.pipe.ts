import {Pipe, PipeTransform} from '@angular/core';
import {toNumber} from '../../utils';

@Pipe({name: 'toNumber'})
export class ToNumberPipe implements PipeTransform {
  public transform(value: number | string): number | undefined {
    return toNumber(value);
  }
}
