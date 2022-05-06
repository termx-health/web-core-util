import {Pipe, PipeTransform} from '@angular/core';
import {getPathValue, isNil} from '../../utils';

@Pipe({name: 'map'})
export class MapPipe implements PipeTransform {
  public transform<T>(values: T[], mapper: string | ((f: T, ...arg: any[]) => boolean), ...fnArg: any[]): T[] | undefined {
    if (isNil(values)) {
      return undefined;
    }
    if (isNil(mapper)) {
      return values;
    }
    return values.map(item => typeof mapper === 'string' ? getPathValue(item, mapper) : mapper(item, ...fnArg));
  }
}
