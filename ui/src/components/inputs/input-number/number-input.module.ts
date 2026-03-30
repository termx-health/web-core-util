import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MuiNumberInputComponent} from './number-input.component';
import {CoreI18nModule} from '@termx-health/core-util';
import {CoreZorroModule} from '../../../zorro';
import {FormsModule} from '@angular/forms';
import {MuiInputModule} from '../input/input.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    CoreI18nModule,

    CoreZorroModule,
    MuiInputModule
  ],
  declarations: [MuiNumberInputComponent],
  exports: [MuiNumberInputComponent],
})
export class MuiNumberInputModule {
}
