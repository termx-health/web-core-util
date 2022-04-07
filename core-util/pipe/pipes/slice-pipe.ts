import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'slice'
})
export class SlicePipe implements PipeTransform {

  public transform(input: any, limit: number, offset: number = 0): any {
    if (!Array.isArray(input)) {
      return input;
    }
    if (!limit) {
      return input;
    }
    return input.slice(offset, offset + limit);
  }

}
