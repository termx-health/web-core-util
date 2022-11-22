import {OnDestroy, Pipe, PipeTransform} from '@angular/core';
import {equalsDeep, format as formatDate, getDateFormat, isNil} from '../../utils';
import {LIB_CONTEXT} from '../../core-util.context';
import {CoreI18nBasePipe, CoreI18nService} from '../../i18n';

@Pipe({name: 'localDate', pure: false})
export class LocalDatePipe extends CoreI18nBasePipe implements PipeTransform, OnDestroy {
  private formattedDate: string | undefined = '';

  private latestDate: Date | string | number | undefined;
  private latestParams: {format?: string | undefined, timezone?: string | undefined, locale?: string | undefined} = {};

  public constructor(protected override translateService: CoreI18nService) {
    super(translateService);
  }

  public updateValue(date?: Date | string | number, format?: string, timezone?: string, locale: string = LIB_CONTEXT.locale): void {
    this.formattedDate = formatDate(date, format || getDateFormat(locale), locale, timezone);
    this.latestDate = date;
    this.latestParams = {format, timezone, locale};
  }

  public transform(date?: Date | string | number, format?: string, timezone?: string, locale?: string): string | undefined {
    if (isNil(date)) {
      return '';
    }

    if (equalsDeep(date, this.latestDate) && equalsDeep({format, timezone, locale}, this.latestParams)) {
      return this.formattedDate;
    }

    this.latestDate = date;
    this.latestParams = {format, timezone, locale};
    this.updateValue(date, format, timezone, locale);

    this._dispose();
    this._subscribeOnChanges(() => {
      if (this.latestDate) {
        this.latestDate = undefined;
        this.updateValue(date, format, timezone, locale);
      }
    });

    return this.formattedDate;
  }

  public ngOnDestroy(): void {
    this._dispose();
  }
}
