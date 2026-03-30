import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MuiSearchInputComponent} from './search-input.component';
import {MuiSelectModule} from '../select/select.module';
import {FormsModule} from '@angular/forms';
import {CoreUtilModule} from '@termx-health/core-util';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    CoreUtilModule,

    MuiSelectModule,
  ],
  declarations: [MuiSearchInputComponent],
  exports: [MuiSearchInputComponent],
})
export class MuiSearchInputModule {
}
