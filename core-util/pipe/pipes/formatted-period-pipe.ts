import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import moment from 'moment/moment';

import {DateRange} from '../../model/date-range';

@Pipe({
  name: 'formattedPeriod'
})
export class FormattedPeriodPipe implements PipeTransform {
  public YEAR = 'year';
  public MONTH = 'month';
  public DAY = 'day';
  public HOUR = 'hour';
  public MINUTE = 'minute';
  public SECOND = 'second';

  private translationKeys: {[key: string]: string};

  constructor(private translateService: TranslateService) {
    this.translationKeys = {};
    this.translationKeys[this.YEAR] = 'core.period.years';
    this.translationKeys[this.MONTH] = 'core.period.months';
    this.translationKeys[this.DAY] = 'core.period.days';
    this.translationKeys[this.HOUR] = 'core.period.hours';
    this.translationKeys[this.MINUTE] = 'core.period.minutes';
    this.translationKeys[this.SECOND] = 'core.period.seconds';
  }

    //TODO: observable translations
  public transform(period: DateRange | Date, opts: FormattedPeriodOptions = {}): string {
    if (!period) {
      return '';
    }
    opts.precision = opts.precision || 'day';
    opts.minPrecision = opts.minPrecision || opts.precision;

    const startDate = period.hasOwnProperty('lower') ? moment((<DateRange>period).lower) : moment(<Date>period);
    const endDate = period.hasOwnProperty('lower') ? moment((<DateRange>period).upper || new Date()) : moment();
    const duration = moment.duration(endDate.diff(startDate));

    let result = ``;
    let force = false;


    for (const precision of [this.YEAR, this.MONTH, this.DAY, this.HOUR, this.MINUTE, this.SECOND]) {
      const val = precision === this.YEAR ? duration.years() :
        precision === this.MONTH ? duration.months() :
        precision === this.DAY ? duration.days() :
        precision === this.HOUR ? duration.hours() :
        precision === this.MINUTE ? duration.minutes() :
        precision === this.SECOND ? duration.seconds() :
        null;
      force = force || val > 0 || opts.minPrecision === precision || opts.precision === precision;
      if (force) {
        result = `${result} ${val}${this.tr(precision)}`;
      }
      if (opts.precision === precision) {
        return result.trim();
      }
    }
    return undefined;
  }

  private tr(precision: string): string {
    return this.translateService.instant(this.translationKeys[precision]);
  }

}

export class FormattedPeriodOptions {
  public precision?: string = 'day';
  public minPrecision?: string = 'day';
}
