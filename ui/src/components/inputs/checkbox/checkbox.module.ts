import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MuiCheckboxComponent} from './checkbox.component';
import {MuiIconModule} from '../../icon';
import {FormsModule} from '@angular/forms';
import {CoreZorroModule} from '../../../zorro';
import {CoreUtilModule} from '@termx-health/core-util';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    CoreUtilModule,

    CoreZorroModule,
    MuiIconModule
  ],
  declarations: [MuiCheckboxComponent],
  exports: [MuiCheckboxComponent]
})
export class MuiCheckboxModule {
}
