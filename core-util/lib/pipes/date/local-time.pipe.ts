import {Pipe, PipeTransform} from '@angular/core';
import {getTimeFormat} from '../../utils';
import {LocalDatePipe} from './local-date.pipe';
import {LIB_CONTEXT} from '../../core-util.context';

@Pipe({name: 'localTime', pure: false})
export class LocalTimePipe extends LocalDatePipe implements PipeTransform {
  public override transform(date?: Date | string, format?: string, locale: string = LIB_CONTEXT.locale): string | undefined {
    return super.transform(date, format || getTimeFormat(locale), locale);
  }
}
