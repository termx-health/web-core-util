import {OnDestroy, Pipe, PipeTransform} from '@angular/core';
import {DateRange} from '../../models';
import {CoreI18nBasePipe, CoreI18nService} from '../../i18n';
import {equalsDeep, isNil} from '../../utils';
import {intervalToDuration} from 'date-fns';

export type FormattedPeriodPrecision = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second';

export class FormattedPeriodParams {
  public precision?: FormattedPeriodPrecision = 'day';
  public minPrecision?: FormattedPeriodPrecision = 'day';
}


const TRANSLATION_MAP: { [key in FormattedPeriodPrecision]: string } = {
  year: 'core.period.years',
  month: 'core.period.months',
  day: 'core.period.days',
  hour: 'core.period.hours',
  minute: 'core.period.minutes',
  second: 'core.period.seconds'
};

@Pipe({name: 'formattedPeriod', pure: false})
export class FormattedPeriodPipe extends CoreI18nBasePipe implements PipeTransform, OnDestroy {
  private translatedValue: string = '';
  private latestPeriod: DateRange | Date | undefined;
  private latestParams: FormattedPeriodParams | undefined;

  public constructor(protected override translateService: CoreI18nService) {
    super(translateService);
  }

  public updateValue(tokens: {precision: FormattedPeriodPrecision, val: number}[]): void {
    const strings = tokens.map(t => `${t.val}${this.translateService.instant(TRANSLATION_MAP[t.precision])}`);
    this.translatedValue = strings.join(' ');
  }

  public transform(period?: DateRange | Date, params: FormattedPeriodParams = {}): string {
    if (isNil(period)) {
      return '';
    }
    if (equalsDeep(period, this.latestPeriod) && equalsDeep(params, this.latestParams)) {
      return this.translatedValue;
    }

    this.latestPeriod = period;
    this.latestParams = params;

    const tokens = this.getTranslationKey(period, {
      precision: params.precision || 'day',
      minPrecision: params.minPrecision || params.precision
    });
    this.updateValue(tokens);

    this._dispose();
    this._subscribeOnChanges(() => {
      if (this.latestPeriod) {
        this.latestPeriod = undefined;
        this.updateValue(tokens);
      }
    });

    return this.translatedValue;
  }


  private getTranslationKey(period: DateRange | Date, params: FormattedPeriodParams): {precision: FormattedPeriodPrecision, val: number}[] {
    const startDate = period.hasOwnProperty('lower') ? new Date((<DateRange>period).lower!) : new Date(<Date>period);
    const endDate = period.hasOwnProperty('upper') ? new Date((<DateRange>period).upper!) : new Date();
    const duration = intervalToDuration({start: startDate, end: endDate});

    const precisionMap: { [key in FormattedPeriodPrecision]: number } = {
      year: duration.years || 0,
      month: duration.months || 0,
      day: duration.days || 0,
      hour: duration.hours || 0,
      minute: duration.minutes || 0,
      second: duration.seconds || 0
    };

    const tokens = [];

    let force = false;
    for (const precision of ['year', 'month', 'day', 'hour', 'minute', 'second'] as FormattedPeriodPrecision[]) {
      const val = precisionMap[precision];
      force = force || val > 0 || params.minPrecision === precision || params.precision === precision;
      if (force) {
        tokens.push({precision: precision, val: val});
      }

      if (params.precision === precision) {
        return tokens;
      }
    }
    return [];
  }

  public ngOnDestroy(): void {
    this._dispose();
  }
}
