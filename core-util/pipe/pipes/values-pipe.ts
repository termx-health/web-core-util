import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'values'
})
export class ValuesPipe implements PipeTransform {

  public transform(input: any): Array<any> {
    if (!input) {
      return [];
    }
    return Object.values(input);
  }

}
