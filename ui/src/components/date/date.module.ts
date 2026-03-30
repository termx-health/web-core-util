import {NgModule} from '@angular/core';
import {MuiDatePickerModule} from './date-picker';
import {MuiDateTimePickerModule} from './date-time-picker/date-time-picker.module';
import {MuiTimePickerModule} from './time-picker';


@NgModule({
  imports: [
    MuiDatePickerModule,
    MuiTimePickerModule,
    MuiDateTimePickerModule,
  ],
  exports: [
    MuiDatePickerModule,
    MuiTimePickerModule,
    MuiDateTimePickerModule,
  ],
})
export class MuiDateModule {
}
