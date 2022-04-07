import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'merge'
})
export class MergePipe implements PipeTransform {

  public transform<T>(target: T[], source: any[], compareWith: string | ((o1: T, o2: T) => boolean)): T[] {
    if (!target) {
      target = [];
    }
    if (!source?.length) {
      return target;
    }
    return [...target.filter(Boolean), ...source.filter(Boolean)].reduce((result, val) => {
      if (!result.some(i => this.compare(i, val, compareWith))) {
        result.push(val);
      }
      return result;
    }, []);
  }

  private compare<T>(o1: T, o2: T, compareWith: string | ((o1: T, o2: T) => boolean)): boolean {
    if (typeof (compareWith) === 'string') {
      return o1 && o2 && o1[compareWith] === o2[compareWith];
    }
    return compareWith(o1, o2);
  }


}
