import {Pipe, PipeTransform} from '@angular/core';
import {isNil} from '../../utils';

@Pipe({
  name: 'keys'
})
export class KeysPipe implements PipeTransform {
  public transform(input: any): string[] {
    if (isNil(input)) {
      return [];
    }
    return Object.keys(input);
  }
}
