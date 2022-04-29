import {OnDestroy, Pipe, PipeTransform} from '@angular/core';
import {equalsDeep, isDefined} from '../utils';
import {CoreI18nBasePipe} from './i18n-base.pipe';
import {CoreI18nService, CoreI18nTranslateParams} from './i18n.service';


@Pipe({
  name: 'i18n',
  pure: false
})
export class CoreI18nPipe extends CoreI18nBasePipe implements PipeTransform, OnDestroy {
  private translatedValue: string = '';

  private latestKey: string | undefined;
  private latestParams: CoreI18nTranslateParams | undefined;

  public constructor(protected override translateService: CoreI18nService) {
    super(translateService);
  }


  public updateValue(key: string, params?: CoreI18nTranslateParams): void {
    this._translate(key, params, (res: string): void => {
      this.translatedValue = isDefined(res) ? res : key;
      this.latestKey = key;
      this.latestParams = params;
    });
  }


  public transform(key: string, params?: CoreI18nTranslateParams): string {
    if (!key || !key.length) {
      return key;
    }

    if (equalsDeep(key, this.latestKey) && equalsDeep(params, this.latestParams)) {
      return this.translatedValue;
    }

    this.latestKey = key;
    this.latestParams = params;
    this.updateValue(key, params);

    this._dispose();
    this._subscribeOnChanges(() => {
      if (this.latestKey) {
        this.latestKey = undefined;
        this.updateValue(key, params);
      }
    });

    return this.translatedValue;
  }

  public ngOnDestroy(): void {
    this._dispose();
  }
}

