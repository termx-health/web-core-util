import {HttpClient} from '@angular/common/http';
import {forkJoin, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {I18nTranslation} from './i18n.store';
import {mergeDeep} from './i18n.util';

/* Loader abstract class */
export abstract class I18nTranslateLoader {
  public abstract loadTranslate(lang: string): Observable<I18nTranslation>;
}


/* HTTP loader implementation */
export interface I18nHttpTranslateLoaderConfig {
  resources: I18nHttpTranslateLoaderConfigResource[]
}

export interface I18nHttpTranslateLoaderConfigResource {
  prefix: string,
  namespace?: string
}

export class I18nHttpTranslateLoader extends I18nTranslateLoader {
  private config: I18nHttpTranslateLoaderConfig;
  private httpClient: HttpClient;

  public constructor(httpClient: HttpClient, config: I18nHttpTranslateLoaderConfig = {resources: [{prefix: '/assets/18n'}]}) {
    super();
    this.httpClient = httpClient;
    this.config = config;
  }

  public loadTranslate(lang: string): Observable<I18nTranslation> {
    const loadResource = (r: I18nHttpTranslateLoaderConfigResource): Observable<I18nTranslation> => {
      return this.httpClient.get<I18nTranslation>(`${r.prefix}/${lang}.json`).pipe(map((json: I18nTranslation) => {
        return (r.namespace ? {[r.namespace]: json} : json);
      }));
    };

    const requests = this.config.resources.map(loadResource);
    return forkJoin(requests).pipe(
      map((resps: I18nTranslation[]) => {
        return resps.reduce((acc, r) => mergeDeep(acc, r), {});
      })
    );
  }
}


