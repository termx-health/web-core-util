import {OnDestroy, Pipe, PipeTransform} from '@angular/core';
import {equalsDeep, format as formatDate, getDateFormat, isNil, isValid} from '../../utils';
import {LIB_CONTEXT} from '../../core-util.context';
import {CoreI18nBasePipe, CoreI18nService} from '../../i18n';

@Pipe({name: 'localDate', pure: false})
export class LocalDatePipe extends CoreI18nBasePipe implements PipeTransform, OnDestroy {
  private formattedDate: string | undefined = '';

  private latestDate: Date | string | number | undefined;
  private latestParams: {format?: string | undefined, locale?: string | undefined} = {};

  public constructor(protected override translateService: CoreI18nService) {
    super(translateService);
  }

  public updateValue(date?: Date | string, format?: string, locale: string = LIB_CONTEXT.locale): void {
    this.formattedDate = isValid(date) ? formatDate(date, format || getDateFormat(locale)) : undefined;
    this.latestDate = date;
    this.latestParams = {format, locale};
  }

  public transform(date?: Date | string, format?: string, locale?: string): string | undefined {
    if (isNil(date)) {
      return '';
    }

    if (equalsDeep(date, this.latestDate) && equalsDeep({format, locale}, this.latestParams)) {
      return this.formattedDate;
    }

    this.latestDate = date;
    this.latestParams = {format, locale};
    this.updateValue(date, format, locale);

    this._dispose();
    this._subscribeOnChanges(() => {
      if (this.latestDate) {
        this.latestDate = undefined;
        this.updateValue(date, format, locale);
      }
    });

    return this.formattedDate;
  }

  public ngOnDestroy(): void {
    this._dispose();
  }
}
