import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreI18nModule, CoreUtilModule} from '@termx-health/core-util';
import {MuiDividerComponent} from './divider.component';


@NgModule({
  imports: [
    CommonModule,

    CoreUtilModule,
    CoreI18nModule,
  ],
  declarations: [
    MuiDividerComponent
  ],
  exports: [
    MuiDividerComponent
  ]
})
export class MuiDividerModule {
}
