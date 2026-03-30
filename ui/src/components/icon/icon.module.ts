import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreZorroModule} from '../../zorro';
import {MuiIconComponent} from './icon.component';


@NgModule({
  imports: [
    CommonModule,
    CoreZorroModule
  ],
  declarations: [
    MuiIconComponent
  ],
  exports: [
    MuiIconComponent
  ]
})
export class MuiIconModule {
}
