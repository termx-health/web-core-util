import {ChangeDetectorRef, OnDestroy, Pipe, PipeTransform} from '@angular/core';
import {I18nService, I18nTranslateParams} from './i18n.service';
import {isDefined, isEqual} from './i18n.util';
import {I18nBasePipe} from './i18n-base.pipe';


@Pipe({
  name: 'i18n',
  pure: false
})
export class I18nPipe extends I18nBasePipe implements PipeTransform, OnDestroy {
  private translatedValue: string = '';

  private lastKey: string = null;
  private lastParams: I18nTranslateParams;

  public constructor(
    protected translateService: I18nService,
    protected ref: ChangeDetectorRef
  ) {
    super(translateService, ref);
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

    if (isEqual(key, this.lastKey) && isEqual(params, this.lastParams)) {
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

