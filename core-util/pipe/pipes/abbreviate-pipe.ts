import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'abbreviate'
})
export class AbbreviatePipe implements PipeTransform {
  public transform(value: string, maxLength: number): string {
    if (!value || !maxLength) {
      return value;
    }
    if (value.length <= maxLength) {
      return value;
    }
    return value.substring(0, maxLength - 3) + '...';
  }
}
