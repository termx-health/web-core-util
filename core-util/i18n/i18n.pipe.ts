import {ChangeDetectorRef, OnDestroy, Pipe, PipeTransform} from '@angular/core';
import {I18nService, I18nTranslateParams} from './i18n.service';
import {combineLatest, Subscription} from 'rxjs';
import {isDefined, isEqual} from '../util';


@Pipe({
  name: 'i18n',
  pure: false
})
export class I18nPipe implements PipeTransform, OnDestroy {
  private translatedValue: string = '';

  private lastKey: string = null;
  private lastParams: I18nTranslateParams;
  private translateChanges: Subscription;

  public constructor(
    private translate: I18nService,
    private _ref: ChangeDetectorRef
  ) { }


  public updateValue(key: string, params?: I18nTranslateParams): void {
    const onTranslation = (res: string): void => {
      this.translatedValue = isDefined(res) ? res : key;
      this.lastKey = key;
      this.lastParams = params;
      this._ref.markForCheck();
    };
    console.log(this.translate.get(key, params))
    this.translate.get(key, params).subscribe(onTranslation);
  }


  public transform(key: string, params?: I18nTranslateParams): string {
    if (!key || !key.length) {
      return key;
    }

    if (isEqual(key, this.lastKey) && isEqual(params, this.lastParams)) {
      return this.translatedValue;
    }

    this.lastKey = key;
    this.lastParams = params;
    this.updateValue(key, params);
    this._clearSubscriptions();

    if (!this.translateChanges) {
      this.translateChanges = combineLatest([this.translate.localeChange, this.translate.translationChange]).subscribe(() => {
        if (this.lastKey) {
          this.lastKey = null;
          this.updateValue(key, params);
        }
      });
    }

    return this.translatedValue;
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

