import {Pipe, PipeTransform} from '@angular/core';

type SafeArgs<T> = string | number | T | T[] | undefined;

@Pipe({
  name: 'apply'
})
export class ApplyPipe implements PipeTransform {
  public transform<V, A, R>(value: SafeArgs<V>, fun: (f: SafeArgs<V>, arg?: A) => SafeArgs<R>, fnArg?: A): SafeArgs<R | V> {
    return fun?.(value, fnArg) ?? value;
  }
}
