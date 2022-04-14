import {FormatWidth, getLocaleDateFormat, getLocaleTimeFormat} from '@angular/common';

// https://angular.io/api/common/DatePipe#custom-format-options

export function getDateFormat(locale: string): string {
  const localeFormat = getLocaleDateFormat(locale, FormatWidth.Short);
  return localeFormat.replace('yy', 'yyyy');
}

export function getTimeFormat(locale: string): string {
  return getLocaleTimeFormat(locale, FormatWidth.Short);
}

export function getDateTimeFormat(locale: string): string {
  return getDateFormat(locale) + ' ' + getTimeFormat(locale);
}

