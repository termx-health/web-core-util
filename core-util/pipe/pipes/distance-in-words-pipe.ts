import {ChangeDetectorRef, Inject, OnDestroy, Optional, Pipe, PipeTransform} from '@angular/core';
import moment from 'moment/moment';
import {I18nService, I18nTranslateParams} from '../../i18n';
import {KW_CU_NAMESPACE} from '../../core-util.token';
import {isDefined, isEqual} from '../../util';
import {combineLatest, Subscription} from 'rxjs';

@Pipe({
  name: 'distanceInWords',
  pure: false
})
export class DistanceInWordsPipe implements PipeTransform, OnDestroy {
  private readonly namespace: string;

  private translatedValue: string;
  private lastDate: Date;
  private translateChanges: Subscription;

  public constructor(
    @Optional() @Inject(KW_CU_NAMESPACE) namespace: string,
    private translate: I18nService,
    private _ref: ChangeDetectorRef,
  ) {
    this.namespace = namespace;
  }


  public updateValue(date: Date, key: string, params: I18nTranslateParams): void {
    const onTranslation = (res: string): void => {
      this.translatedValue = isDefined(res) ? res : key;
      this.lastDate = date;
      this._ref.markForCheck();
    };
    this.translate.get(key, params).subscribe(onTranslation);
  }


  public transform(date: Date): string {
    if (isEqual(date, this.lastDate)) {
      return this.translatedValue;
    }

    const prefix = this.namespace ? `${this.namespace}.` : '';
    const {key, params} = this.getTranslationKey(date);
    this.lastDate = date;
    this.updateValue(date, `${prefix}${key}`, params);
    this._clearSubscriptions();

    if (!this.translateChanges) {
      this.translateChanges = combineLatest([this.translate.localeChange, this.translate.translationChange]).subscribe({
        next: () => {
          if (this.lastDate) {
            this.lastDate = null;
            this.updateValue(date, key, params);
          }
        }
      });
    }

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

  private _clearSubscriptions(): void {
    if (this.translateChanges) {
      this.translateChanges.unsubscribe();
      this.translateChanges = undefined;
    }
  }

  public ngOnDestroy(): void {
    this._clearSubscriptions();
  }
}
