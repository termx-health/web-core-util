import {Inject, OnDestroy, Optional, Pipe, PipeTransform} from '@angular/core';
import moment from 'moment/moment';
import {KW_CU_NAMESPACE} from '../../core-util.token';
import {equalsDeep, isDefined, isNil} from '../../utils';
import {I18nBasePipe, I18nService, I18nTranslateParams} from '../../i18n';

@Pipe({
  name: 'distanceInWords',
  pure: false
})
export class DistanceInWordsPipe extends I18nBasePipe implements PipeTransform, OnDestroy {
  private translatedValue: string = '';
  private latestDate: Date | undefined;

  public constructor(
    @Optional() @Inject(KW_CU_NAMESPACE) private namespace: string,
    protected override translateService: I18nService
  ) {
    super(translateService);
  }


  public updateValue(date: Date, key: string, params?: I18nTranslateParams): void {
    const prefix = this.namespace ? `${this.namespace}.` : '';
    this._translate(`${prefix}${key}`, params, (res: string): void => {
      this.translatedValue = isDefined(res) ? res : `${prefix}${key}`;
      this.latestDate = date;
    });
  }


  public transform(date: Date): string {
    if (isNil(date)) {
      return '';
    }
    if (equalsDeep(date, this.latestDate)) {
      return this.translatedValue;
    }

    const {key, params} = this.getTranslationKey(date);
    this.latestDate = date;
    this.updateValue(date, key, params);

    this._dispose();
    this._subscribeOnChanges(() => {
      if (this.latestDate) {
        this.latestDate = undefined;
        this.updateValue(date, key, params);
      }
    });

    return this.translatedValue;
  }

  private getTranslationKey(date: Date): {key: string, params?: object} {
    const daysDiff = moment(new Date()).diff(date, 'days');

    if (daysDiff === 0) {
      return {key: `core.pipe.distance-in-words.today`};
    }
    if (daysDiff === 1) {
      return {key: `core.pipe.distance-in-words.yesterday`};
    }
    if (daysDiff > 1 && daysDiff <= 7) {
      return {key: `core.pipe.distance-in-words.days`, params: {days: daysDiff}};
    }
    if (daysDiff > 7 && daysDiff <= 30) {
      return {key: `core.pipe.distance-in-words.weeks`, params: {weeks: Math.round(daysDiff / 7)}};
    }
    if (daysDiff > 30 && daysDiff < 365) {
      return {key: `core.pipe.distance-in-words.months`, params: {months: Math.round(daysDiff / 30)}};
    }
    return {key: `core.pipe.distance-in-words.year`};
  }


  public ngOnDestroy(): void {
    this._dispose();
  }
}
