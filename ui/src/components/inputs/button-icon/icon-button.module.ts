import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MuiIconModule} from '../../icon';
import {MuiIconButtonComponent} from './icon-button.component';
import {MuiButtonModule} from '../button/button.module';


@NgModule({
  imports: [
    CommonModule,

    MuiButtonModule,
    MuiIconModule
  ],
  declarations: [MuiIconButtonComponent],
  exports: [MuiIconButtonComponent],
})
export class MuiIconButtonModule {
}
