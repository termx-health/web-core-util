import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MuiBackendTableComponent} from './backend-table.component';
import {MuiTableModule} from '../table';


@NgModule({
  imports: [
    CommonModule,
    MuiTableModule,
  ],
  declarations: [
    MuiBackendTableComponent,
  ],
  exports: [
    MuiBackendTableComponent
  ]
})
export class MuiBackendTableModule {
}
