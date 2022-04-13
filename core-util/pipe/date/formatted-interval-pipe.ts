import {Pipe, PipeTransform} from '@angular/core';
import {Interval} from '../../model';
import {I18nService} from '../../i18n';

@Pipe({
  name: 'formattedInterval'
})
export class FormattedIntervalPipe implements PipeTransform {

  public YEAR = 'year';
  public MONTH = 'month';
  public DAY = 'day';
  public HOUR = 'hour';
  public MINUTE = 'minute';
  public SECOND = 'second';

  private translationKeys: { [key: string]: string };

  public constructor(private translateService: I18nService) {
    this.translationKeys = {};
    this.translationKeys[this.YEAR] = 'core.period.years';
    this.translationKeys[this.MONTH] = 'core.period.months';
    this.translationKeys[this.DAY] = 'core.period.days';
    this.translationKeys[this.HOUR] = 'core.period.hours';
    this.translationKeys[this.MINUTE] = 'core.period.minutes';
    this.translationKeys[this.SECOND] = 'core.period.seconds';
  }

  public transform(interval: Interval): string {
    if (!interval) {
      return '';
    }
    const out = [];
    if (interval.years > 0) {
      out.push(interval.years + this.tr(this.YEAR));
    }
    if (interval.months > 0) {
      out.push(interval.months + this.tr(this.MONTH));
    }
    if (interval.days > 0) {
      out.push(interval.days + this.tr(this.DAY));
    }
    if (interval.hours > 0) {
      out.push(interval.hours + this.tr(this.HOUR));
    }
    if (interval.minutes > 0) {
      out.push(interval.minutes + this.tr(this.MINUTE));
    }
    if (interval.seconds > 0) {
      out.push(interval.seconds + this.tr(this.SECOND));
    }
    if (interval.years === 0 && interval.months === 0 && interval.days === 0 && interval.hours === 0 && interval.minutes === 0 && interval.seconds === 0) {
      out.push(0);
    }
    return out.join(' ');
  }

  private tr(precision: string): string {
    return this.translateService.instant(this.translationKeys[precision]);
  }

}
