import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreI18nModule, CoreUtilModule} from '@termx-health/core-util';
import {MuiHeaderComponent} from './header.component';


@NgModule({
  imports: [
    CommonModule,

    CoreUtilModule,
    CoreI18nModule,
  ],
  declarations: [
    MuiHeaderComponent
  ],
  exports: [
    MuiHeaderComponent
  ]
})
export class MuiHeaderModule {
}
