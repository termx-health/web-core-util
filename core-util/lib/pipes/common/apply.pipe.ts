import {Pipe, PipeTransform} from '@angular/core';


@Pipe({name: 'apply'})
export class ApplyPipe implements PipeTransform {
  public transform<T>(val: any, fn: (v: any, ...arg: any[]) => T, ...fnArgs: any[]): T {
    return fn?.(val, ...fnArgs);
  }
}
