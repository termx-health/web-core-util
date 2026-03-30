import {ModuleWithProviders, NgModule} from '@angular/core';
import {MuiMarkdownComponent} from './markdown.component';
import {MUI_MARKDOWN_CONFIG, MuiMarkdownConfig} from './markdown.options';


@NgModule({
  declarations: [
    MuiMarkdownComponent
  ],
  exports: [
    MuiMarkdownComponent
  ]
})
export class MarinaMarkdownModule {
  public static configure(config: MuiMarkdownConfig): ModuleWithProviders<MarinaMarkdownModule> {
    return {
      ngModule: MarinaMarkdownModule,
      providers: [
        {provide: MUI_MARKDOWN_CONFIG, useValue: config}
      ]
    };
  }
}
