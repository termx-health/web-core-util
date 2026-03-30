import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OverlayModule} from '@angular/cdk/overlay';
import {CoreI18nModule, CoreUtilModule} from '@termx-health/core-util';
import {MuiButtonModule} from '../inputs';
import {MuiIconModule} from '../icon';
import {MuiPopconfirmComponent, MuiPopconfirmDirective} from './popconfirm.component';


@NgModule({
  imports: [
    CommonModule,
    OverlayModule,

    CoreUtilModule,
    CoreI18nModule,

    MuiButtonModule,
    MuiIconModule
  ],
  declarations: [
    MuiPopconfirmComponent,
    MuiPopconfirmDirective
  ],
  exports: [
    MuiPopconfirmComponent,
    MuiPopconfirmDirective
  ]
})
export class MuiPopconfirmModule {
}
