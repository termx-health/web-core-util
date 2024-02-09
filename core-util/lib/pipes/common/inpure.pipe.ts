import {Pipe, PipeTransform} from '@angular/core';

/**
 * Forces pipe to run on every change.
 * Use with caution!
 */
@Pipe({name: 'inpure', pure: false})
export class InpurePipe implements PipeTransform {
  public transform(input: any): any {
    return Array.isArray(input) ? [...input] : typeof (input) === 'object' ? {...input} : input;
  }
}
