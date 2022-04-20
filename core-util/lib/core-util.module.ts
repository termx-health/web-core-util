import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CorePipesModule} from './pipes';
import {I18nModule, I18nModuleConfig, I18nService, LOCALE_ID} from './i18n';
import {APP_NAMESPACE} from './core-util.token';
import moment from 'moment/moment';
import {LIB_CONTEXT} from './core-util.context';
import {flat} from './utils';


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
  public constructor(protected i18nService: I18nService) {
    i18nService.localeChange.subscribe(locale => {
      LIB_CONTEXT.locale = locale;
      moment.locale(locale); // maybe is not needed? should be handled outside?
    });
  }

  public static forRoot(config: CoreUtilModuleConfig | undefined): ModuleWithProviders<CoreUtilModule> {
    return {
      ngModule: CoreUtilModule,
      providers: flat([
        config?.namespace ? [{provide: APP_NAMESPACE, useValue: config.namespace}] : [],
        config?.locale ? [{provide: LOCALE_ID, useValue: config.locale}] : [],
        config?.loader ? [config?.loader] : []
      ])
    };
  }
}
