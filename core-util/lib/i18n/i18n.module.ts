import {ModuleWithProviders, NgModule} from '@angular/core';
import {LOCALE_ID} from './i18n.token';
import {flat} from '../utils';
import {CoreI18nPipe} from './i18n.pipe';


export interface CoreI18nModuleConfig {
  locale?: string
}

@NgModule({
  imports: [CoreI18nPipe],
  exports: [CoreI18nPipe]
})
export class CoreI18nModule {
  public static forRoot(config: CoreI18nModuleConfig | undefined): ModuleWithProviders<CoreI18nModule> {
    return {
      ngModule: CoreI18nModule,
      providers: [
        flat([
          config?.locale ? [{provide: LOCALE_ID, useValue: config.locale}] : []
        ])
      ]
    };
  }
}
