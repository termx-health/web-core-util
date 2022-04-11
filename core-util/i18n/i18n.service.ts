import {EventEmitter, Inject, Injectable, OnDestroy, Optional, Output} from '@angular/core';


import {KW_CU_LOCALE_ID} from './i18n.token';
import {HttpClient} from '@angular/common/http';
import {I18nStore, I18nTranslation} from './i18n.store';
import {Observable, shareReplay, Subscription, tap} from 'rxjs';
import {map} from 'rxjs/operators';
import {getPathValue} from '../util';
import {I18nHttpTranslateLoader, I18nTranslateLoader} from './i18n.loader';

export type I18nTranslateParams = {[param: string]: any};

@Injectable({
  providedIn: 'root'
})
export class I18nService implements OnDestroy {
  private _store: I18nStore;
  private _loader: I18nTranslateLoader;
  private _translationRequests: {[localeId: string]: Observable<I18nTranslation>} = {};

  @Output() public localeChange = new EventEmitter<string>();
  @Output() public translationChange = new EventEmitter<{[localeId: string]: I18nTranslation}>();

  private _subscriptions: {[key: string]: Subscription} = {};

  public constructor(
    @Optional() @Inject(KW_CU_LOCALE_ID) locale: string,
    @Optional() private translateLoader: I18nTranslateLoader,
    private httpClient: HttpClient
  ) {
    this._store = new I18nStore();
    this._loader = translateLoader || new I18nHttpTranslateLoader(httpClient);

    this._subscriptions['localeChange'] = this._store.langChange.subscribe(val => this.localeChange.emit(val));
    this._subscriptions['translationChange'] = this._store.translationChange.subscribe(val => this.translationChange.emit(val));

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

  public get(key: string, params?: I18nTranslateParams): Observable<string> {
    const localeId = this._store.currentLang;
    const req = this._translationRequests[localeId] = this._translationRequests[localeId] || this.getTranslations(localeId);
    return req.pipe(map(trs => this.parseTranslation(trs, key, params)));
  }


  private getTranslations(localeId: string): Observable<I18nTranslation> {
    return this._loader.loadTranslate(localeId).pipe(tap(trs => this._store.addTranslations(trs)), shareReplay(1));
  }

  private parseTranslation(translations: I18nTranslation, key: string, params: I18nTranslateParams): string {
    // currently, only flat map is supported! {{obj1.obj2.obj3.key}} is yet to be implemented!
    let content = getPathValue(translations, key) as string;
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
