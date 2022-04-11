import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';
import {CorePipesModule} from './pipe';
import {I18nModuleConfig, KW_CU_LOCALE_ID} from './i18n';
import {KW_CU_NAMESPACE} from './core-util.token';

export interface CoreUtilModuleConfig extends I18nModuleConfig {
  namespace?: string
}

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  exports: [
    CorePipesModule
  ]
})
export class CoreUtilModule {
  static forRoot(config: CoreUtilModuleConfig): ModuleWithProviders<CoreUtilModule> {
    return {
      ngModule: CoreUtilModule,
      providers: [
        {provide: KW_CU_LOCALE_ID, useValue: config.locale},
        {provide: KW_CU_NAMESPACE, useValue: config.namespace},
      ]
    };
  }

}
