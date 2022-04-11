import {FormatWidth, getLocaleDateFormat, getLocaleTimeFormat} from '@angular/common';

export class LocalDateUtil {
  static getDateFormat(locale: string): string {
    const localeFormat = getLocaleDateFormat(locale, FormatWidth.Short);
    return localeFormat.replace('yy', 'yyyy');
  }

  static getMonthFormat(locale: string): string {
    const localeFormat = getLocaleDateFormat(locale, FormatWidth.Short);
    return localeFormat
      .replace('yy', 'yyyy')
      .replace('d/', '')
      .replace('dd.', '');
  }

  static getTimeFormat(locale: string): string {
    return getLocaleTimeFormat(locale, FormatWidth.Short);
  }

  static getDateTimeFormat(locale: string): string {
    return LocalDateUtil.getDateFormat(locale) + ' ' + LocalDateUtil.getTimeFormat(locale);
  }

}
