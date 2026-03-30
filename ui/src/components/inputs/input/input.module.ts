import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MuiInputComponent} from './input.component';
import {MuiInputDirective} from './input.directive';
import {FormsModule} from '@angular/forms';
import {CoreI18nModule, CoreUtilModule} from '@termx-health/core-util';
import {CoreZorroModule} from '../../../zorro';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    CoreUtilModule,
    CoreI18nModule,

    CoreZorroModule
  ],
  declarations: [MuiInputComponent, MuiInputDirective],
  exports: [MuiInputComponent, MuiInputDirective],
})
export class MuiInputModule {
}
