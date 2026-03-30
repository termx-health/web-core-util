import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MuiNumberRangeInputComponent} from './number-range-input.component';
import {FormsModule} from '@angular/forms';
import {MuiNumberInputModule} from '../input-number/number-input.module';
import {CoreUtilModule} from '@termx-health/core-util';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    CoreUtilModule,

    MuiNumberInputModule
  ],
  declarations: [MuiNumberRangeInputComponent],
  exports: [MuiNumberRangeInputComponent],
})
export class MuiNumberRangeInputModule {
}
