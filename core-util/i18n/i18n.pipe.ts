import {OnDestroy, Pipe, PipeTransform} from '@angular/core';
import {I18nService, I18nTranslateParams} from './i18n.service';
import {equalsDeep, isDefined} from '../utils';
import {I18nBasePipe} from './i18n-base.pipe';


@Pipe({
  name: 'i18n',
  pure: false
})
export class I18nPipe extends I18nBasePipe implements PipeTransform, OnDestroy {
  private translatedValue: string = '';

  private lastKey: string;
  private lastParams: I18nTranslateParams;

  public constructor(protected translateService: I18nService) {
    super(translateService);
  }


  public updateValue(key: string, params?: I18nTranslateParams): void {
    this._translate(key, params, (res: string): void => {
      this.translatedValue = isDefined(res) ? res : key;
      this.lastKey = key;
      this.lastParams = params;
    });
  }


  public transform(key: string, params?: I18nTranslateParams): string {
    if (!key || !key.length) {
      return key;
    }

    if (equalsDeep(key, this.lastKey) && equalsDeep(params, this.lastParams)) {
      return this.translatedValue;
    }

    this.lastKey = key;
    this.lastParams = params;
    this.updateValue(key, params);

    this._dispose();
    this._subscribeOnChanges(() => {
      if (this.lastKey) {
        this.lastKey = null;
        this.updateValue(key, params);
      }
    });

    return this.translatedValue;
  }

  public ngOnDestroy(): void {
    this._dispose();
  }
}

