import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MuiTreeSelectComponent} from './tree-select.component';
import {CoreI18nModule, CoreUtilModule} from '@termx-health/core-util';
import {CoreZorroModule} from '../../../zorro';
import {MuiSpinnerModule} from '../../spinner';
import {FormsModule} from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    CoreUtilModule,
    CoreI18nModule,

    CoreZorroModule,
    MuiSpinnerModule
  ],
  declarations: [MuiTreeSelectComponent],
  exports: [MuiTreeSelectComponent],
})
export class MuiTreeSelectModule {
}
