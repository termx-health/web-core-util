import {OnDestroy, Pipe, PipeTransform} from '@angular/core';
import {equalsDeep, from, isDefined, isNil} from '../../utils';
import {CoreI18nBasePipe, CoreI18nService, CoreI18nTranslateParams} from '../../i18n';
import {differenceInDays} from 'date-fns';

@Pipe({name: 'distanceInWords', pure: false})
export class DistanceInWordsPipe extends CoreI18nBasePipe implements PipeTransform, OnDestroy {
  private translatedValue: string = '';
  private latestDate: Date | undefined;

  public constructor(protected override translateService: CoreI18nService) {
    super(translateService);
  }


  public updateValue(date: Date, key: string, params?: CoreI18nTranslateParams): void {
    this._translate(key, params, (res: string): void => {
      this.translatedValue = isDefined(res) ? res : key;
      this.latestDate = date;
    });
  }


  public transform(_date: Date): string {
    if (isNil(_date)) {
      return '';
    }

    const date = from(_date);
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
    const daysDiff = differenceInDays(new Date(), date);

    if (daysDiff === 0) {
      return {key: `core.pipe.distanceInWords.today`};
    }
    if (daysDiff === 1) {
      return {key: `core.pipe.distanceInWords.yesterday`};
    }
    if (daysDiff > 1 && daysDiff <= 7) {
      return {key: `core.pipe.distanceInWords.days`, params: {days: daysDiff}};
    }
    if (daysDiff > 7 && daysDiff <= 30) {
      return {key: `core.pipe.distanceInWords.weeks`, params: {weeks: Math.round(daysDiff / 7)}};
    }
    if (daysDiff > 30 && daysDiff < 365) {
      return {key: `core.pipe.distanceInWords.months`, params: {months: Math.round(daysDiff / 30)}};
    }
    return {key: `core.pipe.distanceInWords.year`};
  }


  public ngOnDestroy(): void {
    this._dispose();
  }
}
