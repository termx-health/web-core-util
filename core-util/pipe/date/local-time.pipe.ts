import {Pipe, PipeTransform} from '@angular/core';
import {getTimeFormat} from '../../util';
import {LocalDatePipe} from './local-date.pipe';
import {LIB_CONTEXT} from '../../core-util.context';

@Pipe({
  name: 'localTime',
  pure: false
})
export class LocalTimePipe extends LocalDatePipe implements PipeTransform {
  public transform(value: Date | string | number, timezone?: string, locale?: string): string | null {
    const format = getTimeFormat(LIB_CONTEXT.locale);
    return super.transform(value, format, timezone, locale);
  }
}
