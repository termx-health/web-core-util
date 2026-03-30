import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MuiTextareaComponent} from './textarea.component';
import {FormsModule} from '@angular/forms';
import {CoreI18nModule} from '@termx-health/core-util';
import {CoreZorroModule} from '../../../zorro';
import {MuiInputModule} from '../input/input.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    CoreI18nModule,

    CoreZorroModule,
    MuiInputModule
  ],
  declarations: [MuiTextareaComponent],
  exports: [MuiTextareaComponent],
})
export class MuiTextareaModule {
}
