import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'keys'
})
export class KeysPipe implements PipeTransform {

  public transform(input: any): Array<any> {
    if (!input) {
      return [];
    }
    return Object.keys(input);
  }

}
