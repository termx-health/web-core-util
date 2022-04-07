import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'format'
})
export class FormatPipe implements PipeTransform {

  public transform(value: any, formatter: (f: any, arg?: any) => any, fnArg?: any): any {
    return !formatter ? value : formatter(value, fnArg);
  }
}
