import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MuiSelectComponent} from './select.component';
import {MuiOptionComponent} from './option.component';
import {MuiSelectButtonComponent} from './select-button.component';
import {MuiSpinnerModule} from '../../spinner';
import {FormsModule} from '@angular/forms';
import {CoreI18nModule, CoreUtilModule} from '@termx-health/core-util';
import {CoreZorroModule} from '../../../zorro';
import {MuiInputModule} from '../input/input.module';
import {MuiAbbreviateModule} from '../../abbreviate';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    CoreUtilModule,
    CoreI18nModule,

    CoreZorroModule,
    MuiSpinnerModule,
    MuiInputModule,
    MuiAbbreviateModule
  ],
  declarations: [
    MuiSelectComponent,
    MuiOptionComponent,
    MuiSelectButtonComponent
  ],
  exports: [
    MuiSelectComponent,
    MuiOptionComponent,
    MuiSelectButtonComponent
  ]
})
export class MuiSelectModule {
}
