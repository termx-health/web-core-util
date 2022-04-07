import {DatePipe} from '@angular/common';
import {Inject, Injectable, LOCALE_ID, Pipe, PipeTransform} from '@angular/core';
import {LocalDateUtil} from '../../util/local-date.util';

@Injectable({providedIn: 'root'})
@Pipe({name: 'localDate'})
export class LocalDatePipe extends DatePipe implements PipeTransform {

  constructor(@Inject(LOCALE_ID) private _locale: string) {
    super(_locale);
  }

  // @ts-ignore
  public transform(value: any, format?: string, timezone?: string, locale?: string): string | null {
    return super.transform(value, format || LocalDateUtil.getDateFormat(this._locale), timezone, locale);
  }

}
