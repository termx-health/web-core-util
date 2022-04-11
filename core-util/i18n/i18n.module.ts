import {ModuleWithProviders, NgModule, Provider} from '@angular/core';
import {I18nPipe} from './i18n.pipe';
import {KW_CU_LOCALE_ID} from './i18n.token';


export interface I18nModuleConfig {
  locale?: string,
  loader?: Provider;
}

@NgModule({
  declarations: [I18nPipe],
  exports: [I18nPipe]
})
export class I18nModule {
  public static forRoot(config: I18nModuleConfig): ModuleWithProviders<I18nModule> {
    return {
      ngModule: I18nModule,
      providers: [
        {provide: KW_CU_LOCALE_ID, useValue: config.locale},
        config.loader
      ]
    };
  }
}
