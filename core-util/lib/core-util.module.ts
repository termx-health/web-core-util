import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CorePipesModule} from './pipes';
import {CoreI18nModule, CoreI18nModuleConfig, CoreI18nService, LOCALE_ID} from './i18n';
import moment from 'moment/moment';
import {LIB_CONTEXT} from './core-util.context';
import {flat} from './utils';
import {EN, ET} from './locales';


export interface CoreUtilModuleConfig extends CoreI18nModuleConfig {
}

@NgModule({
  imports: [
    CommonModule,
    CoreI18nModule
  ],
  exports: [
    CorePipesModule
  ]
})
export class CoreUtilModule {
  public constructor(protected i18nService: CoreI18nService) {
    i18nService.addTranslations({'en': EN, 'et': ET});
    i18nService.localeChange.subscribe(locale => {
      LIB_CONTEXT.locale = locale;
      moment.locale(locale); // maybe is not needed? should be handled outside?
    });
  }

  public static forRoot(config: CoreUtilModuleConfig | undefined): ModuleWithProviders<CoreUtilModule> {
    return {
      ngModule: CoreUtilModule,
      providers: flat([
        config?.locale ? [{provide: LOCALE_ID, useValue: config.locale}] : []
      ])
    };
  }
}
