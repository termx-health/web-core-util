import {Pipe, PipeTransform} from '@angular/core';


@Pipe({name: 'apply'})
export class ApplyPipe implements PipeTransform {
  // todo: add generics
  public transform(value: any, fun: (f: any, ...arg: any) => any, ...fnArg: any): any {
    return fun?.(value, ...fnArg) ?? value;
  }
}
