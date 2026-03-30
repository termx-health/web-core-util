import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreI18nModule, CoreI18nService, CoreUtilModule} from '@termx-health/core-util';
import {CoreZorroModule} from './zorro';
import {DE, EN, ET, FR, LT, NL, RU, UZ_CYRL, UZ_LATN} from './locales';
import {MarinaComponentsModule} from './components/components.module';
import {MarinPageLayoutModule} from './page';
import {MuiHttpErrorNotificationModule} from './http/http-error-notification.module';


@NgModule({
  imports: [
    CommonModule,
    CoreUtilModule,
    CoreI18nModule,
    MuiHttpErrorNotificationModule
  ],
  exports: [
    CoreZorroModule,
    MarinaComponentsModule,
    MarinPageLayoutModule,
    MuiHttpErrorNotificationModule
  ]
})
export class MarinaUiModule {
  public constructor(coreI18nService: CoreI18nService) {
    coreI18nService.addTranslations({
      'en': EN,
      'et': ET,
      'lt': LT,
      'de': DE,
      'fr': FR,
      'nl': NL,
      'ru': RU,
      'uz-CYRL': UZ_CYRL, 'uz-Cyrl': UZ_CYRL,
      'uz-LATN': UZ_LATN, 'uz-Latn': UZ_LATN,
    });
  }
}
