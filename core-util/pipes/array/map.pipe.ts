import {Pipe, PipeTransform} from '@angular/core';
import {getPathValue, isNil} from '../../utils';

@Pipe({
  name: 'map'
})
export class MapPipe implements PipeTransform {
  public transform<T>(values: T[], mapper: string | ((f: T, arg: any) => boolean), fnArg?: any): T[] {
    if (isNil(mapper)) {
      return values;
    }
    if (isNil(values)) {
      return null;
    }
    return values.map(item => typeof mapper === 'string' ? getPathValue(item, mapper) : mapper(item, fnArg));
  }
}
