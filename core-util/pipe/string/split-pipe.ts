import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'split'
})
export class SplitPipe implements PipeTransform {

  public transform(input: string, separator: string): string[] {
    return input ? input.split(separator) : [];
  }

}
