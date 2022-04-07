import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'max'
})
export class MaxPipe implements PipeTransform {

  public transform(items: any[]): any {
    if (!items) {
      return null;
    }
    return Math.max.apply(null, items);
  }
}
