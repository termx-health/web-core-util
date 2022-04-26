import {ModuleWithProviders, NgModule} from '@angular/core';
import {LOCALE_ID} from './i18n.token';
import {flat} from '../utils';


export interface I18nModuleConfig {
  locale?: string
}

@NgModule({
  declarations: [],
  exports: []
})
export class I18nModule {
  public static forRoot(config: I18nModuleConfig | undefined): ModuleWithProviders<I18nModule> {
    return {
      ngModule: I18nModule,
      providers: [
        flat([
          config?.locale ? [{provide: LOCALE_ID, useValue: config.locale}] : []
        ])
      ]
    };
  }
}
