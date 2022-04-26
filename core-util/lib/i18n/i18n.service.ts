import {EventEmitter, Inject, Injectable, OnDestroy, Optional, Output} from '@angular/core';


import {LOCALE_ID} from './i18n.token';
import {I18nStore} from './i18n.store';
import {Subscription} from 'rxjs';
import {getPathValue} from '../utils';
import {Locale} from './locales';


export type I18nTranslateParams = {[param: string]: any};

@Injectable({
  providedIn: 'root'
})
export class I18nService implements OnDestroy {
  private _store: I18nStore;

  @Output() public localeChange = new EventEmitter<string>();
  @Output() public translationChange = new EventEmitter<{[localeId: string]: Locale}>();

  private _subscriptions: {[key: string]: Subscription} = {};

  public constructor(
    @Optional() @Inject(LOCALE_ID) locale: string,
  ) {
    this._store = new I18nStore();
    this._subscriptions['localeChange'] = this._store.langChange.subscribe(val => this.localeChange.emit(val));

    this.use(locale);
  }


  public use(localeId: string): void {
    if (localeId) {
      this._store.use(localeId);
    }
  }

  public instant(key: string, params?: I18nTranslateParams): string {
    // NB: translations may be missing
    return this.parseTranslation(this._store.translations, key, params);
  }

  private parseTranslation(translations: Locale | undefined, key: string, params?: I18nTranslateParams): string {
    // currently, only flat map is supported! {{obj1.obj2.obj3.key}} is yet to be implemented!
    let content = getPathValue(translations, key);
    if (typeof content === 'string') {
      if (params) {
        Object.keys(params).forEach(key => (content = content.replace(new RegExp(`\{\{${key}\}\}`, 'g'), params[key])));
      }
      return content;
    }
    return key;
  }

  public ngOnDestroy(): void {
    if (this._subscriptions) {
      Object.values(this._subscriptions).forEach(s => s.unsubscribe());
      this._subscriptions = {};
    }
  }
}
