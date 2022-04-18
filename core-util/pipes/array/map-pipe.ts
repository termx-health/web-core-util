import {Pipe, PipeTransform} from '@angular/core';
import {getPathValue} from '../../utils';

@Pipe({
  name: 'map'
})
export class MapPipe implements PipeTransform {

  public transform(values: Array<any>, mapper: string | ((f: any, arg: any) => boolean), fnArg?: any): Array<any> {
    if (!mapper) {
      return values;
    }
    if (!values) {
      return values;
    }
    return values.map((item) => {
      return typeof mapper === 'string' ? getPathValue(item, mapper) : mapper(item, fnArg);
    });
  }
}
