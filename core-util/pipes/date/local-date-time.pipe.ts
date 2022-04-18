import {DatePipe} from '@angular/common';
import {Inject, LOCALE_ID, Pipe, PipeTransform} from '@angular/core';
import {getDateTimeFormat} from '../../utils';

@Pipe({name: 'localDateTime'})
export class LocalDateTimePipe extends DatePipe implements PipeTransform {

  public constructor(@Inject(LOCALE_ID) private _locale: string) {
    super(_locale);
  }

  // @ts-ignore
  public transform(value: any, timezone?: string, locale?: string): string | null {
    const format = getDateTimeFormat(this._locale);
    return super.transform(value, format, timezone, locale);
  }

}
