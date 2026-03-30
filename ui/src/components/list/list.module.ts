import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MuiListComponent} from './list.component';
import {MuiListItemComponent} from './list-item.component';
import {MuiSpinnerModule} from '../spinner';
import {MuiNoDataModule} from '../no-data';
import {A11yModule} from '@angular/cdk/a11y';


@NgModule({
  imports: [
    CommonModule,
    A11yModule,

    MuiSpinnerModule,
    MuiNoDataModule
  ],
  declarations: [
    MuiListComponent,
    MuiListItemComponent
  ],
  exports: [
    MuiListComponent,
    MuiListItemComponent
  ]
})
export class MuiListModule {
}
