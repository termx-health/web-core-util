import {ChangeDetectorRef, Inject, Optional, Pipe, PipeTransform} from '@angular/core';
import moment from 'moment/moment';

import {DateRange} from '../../model/range/date-range';
import {I18nBasePipe, I18nService} from '../../i18n';
import {KW_CU_NAMESPACE} from '../../core-util.token';
import {equalsDeep} from '../../util';
import {map} from 'rxjs/operators';
import {forkJoin} from 'rxjs';

export type FormattedPeriodPrecision = 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second';

export class FormattedPeriodParams {
  public precision?: FormattedPeriodPrecision = 'day';
  public minPrecision?: FormattedPeriodPrecision = 'day';
}

const YEAR = 'year';
const MONTH = 'month';
const DAY = 'day';
const HOUR = 'hour';
const MINUTE = 'minute';
const SECOND = 'second';

const TRANSLATION_MAP: { [key in FormattedPeriodPrecision]?: string } = {
  [YEAR]: 'core.period.years',
  [MONTH]: 'core.period.months',
  [DAY]: 'core.period.days',
  [HOUR]: 'core.period.hours',
  [MINUTE]: 'core.period.minutes',
  [SECOND]: 'core.period.seconds'
};

@Pipe({
  name: 'formattedPeriod',
  pure: false
})
export class FormattedPeriodPipe extends I18nBasePipe implements PipeTransform {
  private translatedValue: string;
  private lastPeriod: DateRange | Date;
  private lastParams: FormattedPeriodParams;

  public constructor(
    @Optional() @Inject(KW_CU_NAMESPACE) private namespace: string,
    protected translateService: I18nService
  ) {
    super(translateService);
  }

  public updateValue(tokens: {precision: string, val: number}[]): void {
    const prefix = this.namespace ? `${this.namespace}.` : '';
    const reqs = tokens.map(t => this.translateService.get(`${prefix}${TRANSLATION_MAP[t.precision]}`).pipe(map(trs => `${t.val}${trs}`)));

    forkJoin(reqs).subscribe((strings: string[]) => {
      this.translatedValue = strings.join(' ');
    });
  }

  public transform(period: DateRange | Date, params: FormattedPeriodParams = {}): string {
    if (!period) {
      return '';
    }
    if (equalsDeep(period, this.lastPeriod) && equalsDeep(params, this.lastParams)) {
      return this.translatedValue;
    }

    this.lastPeriod = period;
    this.lastParams = params;

    const tokens = this.getTranslationKey(period, {
      precision: params.precision || 'day',
      minPrecision: params.minPrecision || params.precision
    });
    this.updateValue(tokens);

    this._dispose();
    this._subscribeOnChanges(() => {
      if (this.lastPeriod) {
        this.lastPeriod = null;
        this.updateValue(tokens);
      }
    });

    return this.translatedValue;
  }


  private getTranslationKey(period: DateRange | Date, params: FormattedPeriodParams): {precision: string, val: number}[] {
    const startDate = period.hasOwnProperty('lower') ? moment((<DateRange>period).lower) : moment(<Date>period);
    const endDate = period.hasOwnProperty('lower') ? moment((<DateRange>period).upper || new Date()) : moment();
    const duration = moment.duration(endDate.diff(startDate));

    const precisionMap = {
      [YEAR]: duration.years(),
      [MONTH]: duration.months(),
      [DAY]: duration.days(),
      [HOUR]: duration.hours(),
      [MINUTE]: duration.minutes(),
      [SECOND]: duration.seconds()
    };

    const tokens = [];

    let force = false;
    for (const precision of [YEAR, MONTH, DAY, HOUR, MINUTE, SECOND]) {
      const val = precisionMap[precision];
      force = force || val > 0 || params.minPrecision === precision || params.precision === precision;
      if (force) {
        tokens.push({precision: precision, val: val});
      }

      if (params.precision === precision) {
        return tokens;
      }
    }
  }
}
