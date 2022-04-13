import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CorePipesModule} from './pipe';
import {I18nModule, I18nModuleConfig, I18nService, KW_CU_LOCALE_ID} from './i18n';
import {KW_CU_NAMESPACE} from './core-util.token';
import {LIB_CONTEXT} from './core-util.context';


export interface CoreUtilModuleConfig extends I18nModuleConfig {
  namespace?: string
}

@NgModule({
  imports: [
    CommonModule,
    I18nModule
  ],
  exports: [
    CorePipesModule
  ]
})
export class CoreUtilModule {
  public constructor(private i18nService: I18nService) {
    i18nService.localeChange.subscribe(locale => LIB_CONTEXT.locale = locale);
  }

  public static forRoot(config: CoreUtilModuleConfig): ModuleWithProviders<CoreUtilModule> {
    return {
      ngModule: CoreUtilModule,
      providers: [
        {provide: KW_CU_LOCALE_ID, useValue: config.locale},
        {provide: KW_CU_NAMESPACE, useValue: config.namespace},
      ]
    };
  }
}
