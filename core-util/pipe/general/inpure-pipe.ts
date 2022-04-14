import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'inpure',
  pure: false
})
// forces pipes to run on every change. use with caution
export class InpurePipe implements PipeTransform {

  public transform(input: any): any {
    return Array.isArray(input) ? [...input] : typeof (input) === 'object' ? {...input} : input;
  }

}
