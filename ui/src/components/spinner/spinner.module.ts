import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MuiSpinnerComponent} from './spinner.component';


@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    MuiSpinnerComponent
  ],
  exports: [
    MuiSpinnerComponent
  ]
})
export class MuiSpinnerModule {
}
