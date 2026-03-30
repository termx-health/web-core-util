import {NgModule} from '@angular/core';
import {CoreUtilModule} from '@termx-health/core-util';
import {CommonModule} from '@angular/common';
import {MuiTreeComponent} from './tree.component';
import {MuiTreeViewModule} from '../tree-view';
import {MuiIconModule} from '../icon';


@NgModule({
  imports: [
    CommonModule,
    CoreUtilModule,
    MuiTreeViewModule,
    MuiIconModule,
  ],
  declarations: [
    MuiTreeComponent
  ],
  exports: [
    MuiTreeComponent
  ]
})
export class MuiTreeModule {
}
