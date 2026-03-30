import {NgModule} from '@angular/core';
import {CoreI18nModule, CoreUtilModule} from '@termx-health/core-util';
import {CommonModule} from '@angular/common';
import {MuiRadioButtonDirective, MuiRadioComponent} from './radio.component';
import {CoreZorroModule} from '../../zorro';
import {FormsModule} from '@angular/forms';
import {MuiRadioGroupComponent} from './radio-group.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    CoreUtilModule,
    CoreI18nModule,

    CoreZorroModule
  ],
  declarations: [
    MuiRadioGroupComponent,
    MuiRadioComponent,
    MuiRadioButtonDirective
  ],
  exports: [
    MuiRadioGroupComponent,
    MuiRadioComponent,
    MuiRadioButtonDirective,
  ]
})
export class MuiRadioModule {
}
