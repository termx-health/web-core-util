import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MuiExampleComponent} from './example.component';

@NgModule({
  imports: [
    CommonModule
    // other modules
  ],
  declarations: [
    MuiExampleComponent
  ],
  exports: [
    MuiExampleComponent
  ]
})
export class MuiExampleModule {
  // NB: import & export module in MuiComponentsModule
}
