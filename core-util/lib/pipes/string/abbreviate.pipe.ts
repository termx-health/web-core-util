import {Pipe, PipeTransform} from '@angular/core';
import {isNil} from '../../utils';

@Pipe({name: 'abbreviate'})
export class AbbreviatePipe implements PipeTransform {
  public transform(value: string, maxLength: number, ellipsis = '...'): string {
    if (isNil(value) || isNil(maxLength)) {
      return value;
    }
    if (value.length <= maxLength) {
      return value;
    }
    return value.substring(0, maxLength - 3) + ellipsis;
  }
}
