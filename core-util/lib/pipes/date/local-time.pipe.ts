import {Pipe, PipeTransform} from '@angular/core';
import {getTimeFormat} from '../../utils';
import {LocalDatePipe} from './local-date.pipe';
import {LIB_CONTEXT} from '../../core-util.context';

@Pipe({
  name: 'localTime',
  pure: false
})
export class LocalTimePipe extends LocalDatePipe implements PipeTransform {
  public override transform(date?: Date | string | number, format?: string, timezone?: string, locale?: string): string | undefined {
    const _format = format || getTimeFormat(LIB_CONTEXT.locale);
    return super.transform(date, _format, timezone, locale);
  }
}
