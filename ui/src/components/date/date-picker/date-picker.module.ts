import {NgModule} from '@angular/core';
import {MuiDatePickerComponent} from './date-picker.component';
import {CommonModule} from '@angular/common';
import {CoreZorroModule} from '../../../zorro';
import {MuiIconModule} from '../../icon';
import {CoreI18nModule, CoreUtilModule} from '@termx-health/core-util';
import {FormsModule} from '@angular/forms';
import {MuiTextMaskedModule} from '../text-mask';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CoreUtilModule,
    CoreI18nModule,
    CoreZorroModule,
    MuiIconModule,
    MuiTextMaskedModule
  ],
  declarations: [
    MuiDatePickerComponent
  ],
  exports: [
    MuiDatePickerComponent
  ]
})
export class MuiDatePickerModule {
}
