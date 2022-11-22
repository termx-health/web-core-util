import {FormatWidth, getLocaleDateFormat, getLocaleTimeFormat} from '@angular/common';
import {LIB_CONTEXT} from '../../core-util.context';

export function getLocale(): string {
  return LIB_CONTEXT.locale;
}

// https://angular.io/api/common/DatePipe#custom-format-options

export function getDateFormat(locale: string = getLocale()): string {
  const localeFormat = getLocaleDateFormat(locale, FormatWidth.Short);
  return localeFormat.replace('yy', 'yyyy');
}

export function getTimeFormat(locale: string = getLocale()): string {
  return getLocaleTimeFormat(locale, FormatWidth.Short);
}

export function getDateTimeFormat(locale: string = getLocale()): string {
  return getDateFormat(locale) + ' ' + getTimeFormat(locale);
}

