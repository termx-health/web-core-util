import {BehaviorSubject} from 'rxjs';

export type I18nTranslation = {[key: string]: string | I18nTranslation}

export class I18nStore {
  private _currentLang: string = undefined;
  private _langs: string[] = [];
  private _translations: {[lang: string]: I18nTranslation} = {};

  public readonly langChange = new BehaviorSubject<string>(this._currentLang);
  public readonly translationChange = new BehaviorSubject<{[lang: string]: I18nTranslation}>(this._translations);


  public use(lang: string): void {
    this._currentLang = lang;
    this.addLang(lang);
    this.langChange.next(lang);
  }

  private addLang(lang: string): void {
    if (!this._langs.includes(lang)) {
      this._langs = [...this._langs, lang];
    }
  }

  public addTranslations(translation: I18nTranslation,): void {
    this._translations[this._currentLang] = translation;
    this.translationChange.next(this._translations);
  }


  public get translations(): I18nTranslation {
    return this._translations?.[this._currentLang];
  }

  public get currentLang(): string {
    return this._currentLang;
  }

  public get langs(): string[] {
    return this._langs;
  }
}
