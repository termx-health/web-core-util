import {NgModule} from '@angular/core';
import {CoreI18nModule, CoreUtilModule} from '@termx-health/core-util';
import {CommonModule} from '@angular/common';
import {CoreZorroModule} from '../../../zorro';
import {MuiButtonComponent} from './button.component';


@NgModule({
  imports: [
    CommonModule,
    CoreZorroModule,

    CoreUtilModule,
    CoreI18nModule
  ],
  declarations: [MuiButtonComponent],
  exports: [MuiButtonComponent],
})
export class MuiButtonModule {
}
