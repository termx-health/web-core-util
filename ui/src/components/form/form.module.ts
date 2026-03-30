import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MuiFormColDirective} from './form-col.directive';
import {MuiFormControlComponent} from './form-control.component';
import {MuiFormItemComponent} from './form-item.component';
import {MuiFormRowComponent} from './form-row.component';
import {CoreI18nModule, CoreUtilModule} from '@termx-health/core-util';
import {CoreZorroModule} from '../../zorro';
import {MuiTooltipModule} from '../tooltip';
import {MuiIconModule} from '../icon';


@NgModule({
  imports: [
    CommonModule,

    CoreUtilModule,
    CoreI18nModule,

    CoreZorroModule,
    MuiTooltipModule,
    MuiIconModule
  ],
  declarations: [
    MuiFormColDirective,
    MuiFormControlComponent,
    MuiFormItemComponent,
    MuiFormRowComponent
  ],
  exports: [
    MuiFormColDirective,
    MuiFormControlComponent,
    MuiFormItemComponent,
    MuiFormRowComponent
  ]
})
export class MuiFormModule {
}
