import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MuiTagComponent} from './tag.component';
import {MuiIconModule} from '../icon';
import {CoreI18nModule} from '@termx-health/core-util';


@NgModule({
  imports: [
    CommonModule,
    CoreI18nModule,
    MuiIconModule
  ],
  declarations: [
    MuiTagComponent
  ],
  exports: [
    MuiTagComponent
  ]
})
export class MuiTagModule {
}
