import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'reverse'
})
export class ReversePipe implements PipeTransform {

  public transform(input: any): any {
    if (!Array.isArray(input)) {
      return input;
    }
    return input.reverse();
  }
}
