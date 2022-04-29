import {BehaviorSubject} from 'rxjs';
import {isDefined, mergeDeep} from '../utils';
import {Locale} from './locale';
import {EN, ET} from '../locales';


export class CoreI18nStore {
  private _currentLang: string | undefined = undefined;
  private _translations: {[lang: string]: Locale} = {
    en: EN,
    et: ET,
  };

  public readonly langChange = new BehaviorSubject<string | undefined>(this._currentLang);
  public readonly translationChange = new BehaviorSubject<{[lang: string]: Locale}>(this._translations);


  public use(lang: string): void {
    this._currentLang = lang;
    this.langChange.next(lang);
  }


  public addTranslations(lang: string, locale: Locale): void {
    if (isDefined(lang) && isDefined(locale)) {
      this._translations[lang] = mergeDeep((this._translations[lang] || {}), locale);
      this.translationChange.next(this._translations);
    }
  }

  public get translations(): Locale | undefined {
    if (isDefined(this._currentLang)) {
      return this._translations[this._currentLang];
    }
  }

  public get currentLang(): string | undefined {
    return this._currentLang;
  }
}
