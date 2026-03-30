import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreZorroModule} from '../../../zorro';
import {MuiIconModule} from '../../icon';
import {CoreI18nModule} from '@termx-health/core-util';
import {FormsModule} from '@angular/forms';
import {MuiTimePickerComponent} from './time-picker.component';
import {MuiTextMaskedModule} from '../text-mask';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    CoreI18nModule,
    CoreZorroModule,
    MuiIconModule,
    MuiTextMaskedModule
  ],
  declarations: [
    MuiTimePickerComponent
  ],
  exports: [
    MuiTimePickerComponent
  ]
})
export class MuiTimePickerModule {
}
