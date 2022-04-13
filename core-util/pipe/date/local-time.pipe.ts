import {DatePipe} from '@angular/common';
import {Inject, LOCALE_ID, Pipe, PipeTransform} from '@angular/core';
import {LocalDateUtil} from '../../util';

@Pipe({name: 'localTime'})
export class LocalTimePipe extends DatePipe implements PipeTransform {

  constructor(@Inject(LOCALE_ID) private _locale: string) {
    super(_locale);
  }

  // @ts-ignore
  public transform(value: Date | string | number, timezone?: string, locale?: string): string | null {
    const format = LocalDateUtil.getTimeFormat(this._locale);
    return super.transform(value, format, timezone, locale);
  }

}
