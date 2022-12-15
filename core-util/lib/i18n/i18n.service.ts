import {EventEmitter, Inject, Injectable, OnDestroy, Optional, Output} from '@angular/core';


import {LOCALE_ID, TRANSLATION_HANDLER} from './i18n.token';
import {CoreI18nStore} from './i18n.store';
import {Subscription} from 'rxjs';
import {getPathValue, isNil} from '../utils';
import {Locale} from './locale';


export type CoreI18nTranslateParams = {[param: string]: any};
export type CoreI18nTranslationHandler = (key: string, params: any) => string;


@Injectable({providedIn: 'root'})
export class CoreI18nService implements OnDestroy {
  private _store: CoreI18nStore;

  @Output() public localeChange = new EventEmitter<string>();
  @Output() public translationChange = new EventEmitter<{[localeId: string]: Locale}>();

  private _subscriptions: {[key: string]: Subscription} = {};

  public constructor(
    @Optional() @Inject(LOCALE_ID) locale: string,
    @Optional() @Inject(TRANSLATION_HANDLER) private translationHandler?: CoreI18nTranslationHandler,
  ) {
    this._store = new CoreI18nStore();
    this._subscriptions['localeChange'] = this._store.langChange.subscribe(val => this.localeChange.emit(val));
    this._subscriptions['translationChange'] = this._store.translationChange.subscribe(val => this.translationChange.emit(val));

    this.use(locale);
  }


  public use(localeId: string): void {
    if (localeId) {
      this._store.use(localeId);
    }
  }

  public instant(key: string, params?: CoreI18nTranslateParams): string {
    if (isNil(this.currentLang)) {
      return key;
    }

    let res;
    if (this.translationHandler) {
      res = this.translationHandler(key, params);
    }
    if (!res || res === key) {
      // fixme: 'res === key' is it ngx-translate specific?
      res = this.parseTranslation(this._store.translations, key, params);
    }

    return res || key;
  }

  private parseTranslation(translations: Locale | undefined, key: string, params?: CoreI18nTranslateParams): string | undefined {
    // currently, only flat map is supported! {{obj1.obj2.obj3.key}} is yet to be implemented!
    let content = getPathValue<Locale, string>(translations, key);

    if (typeof content === 'string') {
      if (params) {
        Object.keys(params).forEach(key => (content = content?.replace(new RegExp(`\{\{${key}\}\}`, 'g'), params[key])));
      }
      return content;
    }
  }

  public addTranslations(lang: string, locale: Locale): void ;
  public addTranslations(data: {[lang: string]: Locale}): void;
  public addTranslations(...args: unknown[]): void {
    if (args.length === 2) {
      const [lang, locale] = args as [string, Locale];
      return this._store.addTranslations(lang, locale);
    }
    if (args.length == 1) {
      const data = args[0] as {[lang: string]: Locale};
      Object.entries(data).forEach(([lang, locale]) => this._store.addTranslations(lang, locale));
    }
  }


  public ngOnDestroy(): void {
    if (this._subscriptions) {
      Object.values(this._subscriptions).forEach(s => s.unsubscribe());
      this._subscriptions = {};
    }
  }


  public get currentLang(): string | undefined {
    return this._store.currentLang;
  }
}
