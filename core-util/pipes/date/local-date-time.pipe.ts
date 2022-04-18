import {Pipe, PipeTransform} from '@angular/core';
import {getDateTimeFormat} from '../../utils';
import {LIB_CONTEXT} from '../../core-util.context';
import {LocalDatePipe} from './local-date.pipe';

@Pipe({name: 'localDateTime'})
export class LocalDateTimePipe extends LocalDatePipe implements PipeTransform {
  public transform(value: Date | string | number, timezone?: string, locale?: string): string | null {
    const format = getDateTimeFormat(LIB_CONTEXT.locale);
    return super.transform(value, format, timezone, locale);
  }
}
