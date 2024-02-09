import {Pipe, PipeTransform} from '@angular/core';


@Pipe({name: 'apply'})
export class ApplyPipe implements PipeTransform {
  public transform<Val, Return = Val, Args extends unknown[] = []>(
    val: Val,
    fn: (v: Val, ...args: Args) => Return,
    ...fnArgs: Args
  ): Return {
    return fn?.(val, ...fnArgs);
  }
}
