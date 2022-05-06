import {Pipe, PipeTransform} from '@angular/core';
import {join} from '../../utils';

@Pipe({name: 'join'})
export class JoinPipe implements PipeTransform {
  public transform<T>(elements: T | T[], delimiter: string = ''): string | undefined {
    if (Array.isArray(elements)) {
      return join(elements, delimiter);
    }
    return join([elements], delimiter);
  }
}
