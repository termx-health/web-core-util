import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MuiMultiLanguageInputComponent} from './multi-language-input.component';
import {FormsModule} from '@angular/forms';
import {MuiFormModule} from '../../form';
import {CoreZorroModule} from '../../../zorro';
import {CoreI18nModule, CoreUtilModule} from '@termx-health/core-util';
import {MuiInputModule} from '../input/input.module';
import {MuiButtonModule} from '../button/button.module';
import {MuiIconModule} from '../../icon';
import {MuiDropdownModule} from '../../dropdown';
import {MuiTextareaModule} from '../textarea/textarea.module';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    CoreUtilModule,
    CoreI18nModule,
    CoreZorroModule,

    MuiButtonModule,
    MuiIconModule,
    MuiDropdownModule,
    MuiInputModule,
    MuiTextareaModule,
    MuiFormModule,
  ],
  declarations: [MuiMultiLanguageInputComponent],
  exports: [MuiMultiLanguageInputComponent],
})
export class MuiMultiLanguageInputModule {
}
