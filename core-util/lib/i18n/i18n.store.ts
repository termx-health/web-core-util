import {BehaviorSubject} from 'rxjs';
import {isDefined} from '../utils';
import {EN, ET, Locale} from './locales';


export class I18nStore {
  private _currentLang: string | undefined = undefined;
  private _translations: {[lang: string]: Locale} = {
    en: EN,
    et: ET,
  };

  public readonly langChange = new BehaviorSubject<string | undefined>(this._currentLang);


  public use(lang: string): void {
    this._currentLang = lang;
    this.langChange.next(lang);
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
