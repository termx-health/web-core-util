import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MuiAlertComponent} from './alert.component';
import {MuiIconModule} from '../icon';
import {CoreI18nModule, CoreUtilModule} from '@termx-health/core-util';
import {MuiButtonModule} from '../inputs';


@NgModule({
  imports: [
    CommonModule,

    CoreUtilModule,
    CoreI18nModule,

    MuiButtonModule,
    MuiIconModule
  ],
  declarations: [
    MuiAlertComponent
  ],
  exports: [
    MuiAlertComponent
  ]
})
export class MuiAlertModule {
}
