import {Pipe, PipeTransform} from '@angular/core';
import {isNil} from '../../utils';

@Pipe({name: 'substring'})
export class SubstringPipe implements PipeTransform {
  public transform(value: string, startIndex: number, endIndex?: number): string {
    if (isNil(startIndex)) {
      return value;
    }
    if (isNil(endIndex) || endIndex <= startIndex) {
      return value.substring(startIndex);
    }
    return value.substring(startIndex, endIndex);
  }
}
