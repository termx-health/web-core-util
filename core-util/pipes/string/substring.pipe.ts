import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'substring'
})
export class SubstringPipe implements PipeTransform {
  public transform(value: string, startIndex:number, endIndex?: number): string {
    if (!startIndex && startIndex != 0) {
      return value.substring(0);
    }
    if (!endIndex || endIndex <= startIndex) {
      return value.substring(startIndex);
    }
    return value.substring(startIndex, endIndex);
  }
}
