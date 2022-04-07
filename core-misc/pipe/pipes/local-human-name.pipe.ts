import {Pipe, PipeTransform} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {HumanName, HumanNames} from '../../model';

@Pipe({name: 'localHumanName'})
export class LocalHumanNamePipe implements PipeTransform {

  constructor(private translateService: TranslateService) {}

  public transform(value: HumanNames): string {
    return this.localizedName(value);
  }

  private localizedName(value: HumanNames): string {
    if (!value || !value.def) {
      return '';
    }
    const currentLang = this.translateService.currentLang;
    if (currentLang === 'et') {
      return this.formatEt(value.def);
    }
    return value.def.text || '';
  }

  private formatEt(name: HumanName): string {
    if (name.family && name.given) {
      return name.given + ' ' + name.family;
    }
    return name.text || '';
  }
}
