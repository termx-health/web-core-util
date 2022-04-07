import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'concat'
})
export class ConcatPipe implements PipeTransform {

  public transform(input: any, other: any): any {
    if (!other) {
      return input;
    }
    if (Array.isArray(input)) {
      input.concat(other);
    }
    //TODO: strings maybe?
    return input;
  }

}
