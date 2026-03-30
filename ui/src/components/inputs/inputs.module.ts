import {NgModule} from '@angular/core';
import {MuiButtonModule} from './button/button.module';
import {MuiIconButtonModule} from './button-icon/icon-button.module';
import {MuiCheckboxModule} from './checkbox/checkbox.module';
import {MuiInputModule} from './input/input.module';
import {MuiMultiLanguageInputModule} from './input-multi-language/multi-language-input.module';
import {MuiNumberInputModule} from './input-number/number-input.module';
import {MuiNumberRangeInputModule} from './input-number-range/number-range-input.module';
import {MuiSearchInputModule} from './input-search/search-input.module';
import {MuiSelectModule} from './select/select.module';
import {MuiTreeSelectModule} from './select-tree/tree-select.module';
import {MuiTextareaModule} from './textarea/textarea.module';


@NgModule({
  imports: [
    MuiButtonModule,
    MuiIconButtonModule,
    MuiCheckboxModule,
    MuiInputModule,
    MuiMultiLanguageInputModule,
    MuiNumberInputModule,
    MuiNumberRangeInputModule,
    MuiSearchInputModule,
    MuiSelectModule,
    MuiTreeSelectModule,
    MuiTextareaModule
  ],
  exports: [
    MuiButtonModule,
    MuiIconButtonModule,
    MuiCheckboxModule,
    MuiInputModule,
    MuiMultiLanguageInputModule,
    MuiNumberInputModule,
    MuiNumberRangeInputModule,
    MuiSearchInputModule,
    MuiSelectModule,
    MuiTreeSelectModule,
    MuiTextareaModule
  ],
})
export class MuiInputsModule {
}
