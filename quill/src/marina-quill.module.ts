import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MuiQuillComponent} from './quill.component';


@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [MuiQuillComponent],
  exports: [MuiQuillComponent]
})
export class MarinaQuillModule {
}
