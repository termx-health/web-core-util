import {Inject, OnDestroy, Optional, Pipe, PipeTransform} from '@angular/core';
import {Interval} from '../../models';
import {I18nBasePipe, I18nService} from '../../i18n';
import {equalsDeep, isNil} from '../../utils';
import {APP_NAMESPACE} from '../../core-util.token';
import {defaultIfEmpty, map} from 'rxjs/operators';
import {forkJoin} from 'rxjs';


export type FormattedIntervalPrecision = keyof Interval

const TRANSLATION_MAP: { [key in FormattedIntervalPrecision]: string } = {
  years: 'core.period.years',
  months: 'core.period.months',
  days: 'core.period.days',
  hours: 'core.period.hours',
  minutes: 'core.period.minutes',
  seconds: 'core.period.seconds'
};

@Pipe({
  name: 'formattedInterval',
  pure: false
})
export class FormattedIntervalPipe extends I18nBasePipe implements PipeTransform, OnDestroy {
  private translatedValue: string = '';
  private latestInterval: Interval | undefined;

  public constructor(
    @Optional() @Inject(APP_NAMESPACE) private namespace: string,
    protected override translateService: I18nService
  ) {
    super(translateService);
  }

  public updateValue(tokens: {val: number, key: string}[]): void {
    const prefix = this.namespace ? `${this.namespace}.` : '';
    const reqs = tokens.map(t => this.translateService.get(`${prefix}${t.key}`).pipe(map(trs => `${t.val}${trs}`))) || [];
    forkJoin(reqs).pipe(defaultIfEmpty([])).subscribe((strings: string[]) => {
      this.translatedValue = strings.length ? strings.join(' ') : '0';
    });
  }

  public transform(interval: Interval): string {
    if (isNil(interval)) {
      return '';
    }
    if (equalsDeep(interval, this.latestInterval)) {
      return this.translatedValue;
    }

    this.latestInterval = interval;
    const tokens = this.getTranslationKey(interval);
    this.updateValue(tokens);

    this._dispose();
    this._subscribeOnChanges(() => {
      if (this.latestInterval) {
        this.latestInterval = undefined;
        this.updateValue(tokens);
      }
    });

    return this.translatedValue;
  }


  private getTranslationKey(interval: Interval): {val: number, key: string}[] {
    const steps: FormattedIntervalPrecision[] = ['years', 'months', 'days', 'hours', 'minutes', 'seconds'];
    return steps
      .filter(key => interval[key])
      .filter(key => interval[key]! > 0)
      .map(key => ({val: interval[key]!, key: TRANSLATION_MAP[key]}));
  }

  public ngOnDestroy(): void {
    this._dispose();
  }
}
