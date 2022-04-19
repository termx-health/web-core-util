import {Pipe, PipeTransform} from '@angular/core';
import {getDateTimeFormat} from '../../utils';
import {LIB_CONTEXT} from '../../core-util.context';
import {LocalDatePipe} from './local-date.pipe';

@Pipe({name: 'localDateTime'})
export class LocalDateTimePipe extends LocalDatePipe implements PipeTransform {
  public override transform(date?: Date | string | number, format?: string, timezone?: string, locale?: string): string | undefined {
    const _format = format || getDateTimeFormat(LIB_CONTEXT.locale);
    return super.transform(date, _format, timezone, locale);
  }
}
