import {OnDestroy, Pipe, PipeTransform} from '@angular/core';
import {equalsDeep, format as formatDate, getDateFormat, isNil} from '../../utils';
import {LIB_CONTEXT} from '../../core-util.context';
import {I18nBasePipe, I18nService} from '../../i18n';

@Pipe({
  name: 'localDate',
  pure: false
})
export class LocalDatePipe extends I18nBasePipe implements PipeTransform, OnDestroy {
  private formattedDate: string = '';

  private lastDate: Date | string | number;
  private lastParams = {
    format: null,
    timezone: null,
    locale: null
  };

  public constructor(protected translateService: I18nService) {
    super(translateService);
  }

  public updateValue(date: Date | string | number, format?: string, timezone?: string, locale?: string): void {
    this.formattedDate = formatDate(date, format || getDateFormat(LIB_CONTEXT.locale), locale, timezone)
    this.lastDate = date;
    this.lastParams = {format, timezone, locale};
  }

  public transform(date: Date | string | number, format?: string, timezone?: string, locale?: string): string {
    if (isNil(date)) {
      return '';
    }

    if (equalsDeep(date, this.lastDate) && equalsDeep({format, timezone, locale}, this.lastParams)) {
      return this.formattedDate;
    }

    this.lastDate = date;
    this.lastParams = {format, timezone, locale};
    this.updateValue(date, format, timezone, locale);

    this._dispose();
    this._subscribeOnChanges(() => {
      if (this.lastDate) {
        this.lastDate = null;
        this.updateValue(date, format, timezone, locale);
      }
    });

    return this.formattedDate;
  }

  public ngOnDestroy(): void {
    this._dispose();
  }
}
