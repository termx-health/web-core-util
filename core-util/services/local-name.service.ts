import {Injectable} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class LocalNameService {
  private langs = ['et', 'en'];
  constructor(private translateService: TranslateService) {}

  public transform(value: any, defaultValue?: string): string {
    return this.translate(value) || defaultValue;
  }

  private translate(value: any): string {
    if (!value) {
      return '';
    }
    if (typeof value === 'string') {
      return value;
    }
    return this.findName(value);
  }

  private findName(names: any): string {
    const langs = [this.translateService.currentLang].concat(this.langs);
    for (const lang of langs) {
      if (names[lang]) {
        return names[lang];
      }
    }
    return undefined;
  }
}
