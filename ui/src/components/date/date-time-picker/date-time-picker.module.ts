import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {MuiDatePickerModule} from '../date-picker';
import {MuiTimePickerModule} from '../time-picker';
import {MuiDateTimePickerComponent} from './date-time-picker.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    MuiDatePickerModule,
    MuiTimePickerModule
  ],
  declarations: [
    MuiDateTimePickerComponent
  ],
  exports: [
    MuiDateTimePickerComponent
  ]
})
export class MuiDateTimePickerModule {
}
