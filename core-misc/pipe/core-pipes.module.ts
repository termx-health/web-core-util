
import {LocalHumanNamePipe} from './pipes/local-human-name.pipe';
import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {TranslateModule} from '@ngx-translate/core';

const pipes = [
  LocalHumanNamePipe,
];

@NgModule({
  imports: [
    CommonModule,
    TranslateModule
  ],
  declarations: pipes,
  exports: pipes
})
export class CorePipesModule {
}
