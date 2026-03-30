import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MuiAbbreviateComponent} from './abbreviate.component';
import {MuiTooltipModule} from '../tooltip';


@NgModule({
  imports: [
    CommonModule,
    MuiTooltipModule
  ],
  declarations: [
    MuiAbbreviateComponent
  ],
  exports: [
    MuiAbbreviateComponent
  ]
})
export class MuiAbbreviateModule {
}
