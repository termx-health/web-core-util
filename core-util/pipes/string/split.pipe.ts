import {Pipe, PipeTransform} from '@angular/core';
import {isDefined} from '../../utils';

@Pipe({
  name: 'split'
})
export class SplitPipe implements PipeTransform {
  public transform(input: string, separator: string): string[] {
    return isDefined(input) ? input.split(separator) : [];
  }
}
