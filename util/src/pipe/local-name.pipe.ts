import {Pipe, PipeTransform} from '@angular/core';
import {CoreI18nService, equalsDeep} from '@termx-health/core-util';


@Pipe({
  standalone: false,name: 'localName', pure: false})
export class LocalNamePipe implements PipeTransform {
  private latestValue: string;
  private latestLang: string;
  private latestName: any;
  private langs = ['en'];

  public constructor(private i18nService: CoreI18nService) {}

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
    if (equalsDeep(value, this.latestName) && equalsDeep(this.latestLang, this.i18nService.currentLang)) {
      return this.latestValue;
    }
    this.latestLang = this.i18nService.currentLang;
    this.latestName = value;
    return this.latestValue = this.findName(value);
  }

  private findName(names: any): string {
    const langs = [this.latestLang, ...this.langs];
    for (const lang of langs) {
      if (names[lang]) {
        return names[lang];
      }
    }
  }
}





