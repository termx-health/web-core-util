import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'includes'
})
export class IncludesPipe implements PipeTransform {

  public transform(input: Array<any>, value: any): boolean {
    return input && input.includes(value);
  }

}
