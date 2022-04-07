import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  public transform(values: Array<any>, filter: (f: any, arg: any) => boolean, fnArg?: any): Array<any> {
    if (!filter) {
      return values;
    }
    if (!values) {
      return [];
    }
    return values.filter((item) => {
      return filter(item, fnArg);
    });
  }
}
