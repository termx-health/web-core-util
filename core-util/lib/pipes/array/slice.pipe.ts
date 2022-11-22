import {Pipe, PipeTransform} from '@angular/core';
import {isNil} from '../../utils';

@Pipe({name: 'aSlice'})
export class SlicePipe implements PipeTransform {
  public transform<T>(input: string | T[], limit: number, offset: number = 0): string | T[] | undefined {
    if (isNil(input)) {
      return undefined;
    }
    if (isNil(limit)) {
      return input;
    }
    if (Array.isArray(input)) {
      return input.slice(offset, offset + limit);
    }
    return input.substring(offset, offset + limit);
  }
}
