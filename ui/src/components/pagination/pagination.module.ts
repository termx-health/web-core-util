import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MuiPaginationComponent} from './pagination.component';
import {MuiButtonModule, MuiSelectModule} from '../inputs';
import {MuiIconModule} from '../icon';
import {CorePipesModule} from '@termx-health/core-util';
import {FormsModule} from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,

    CorePipesModule,

    MuiButtonModule,
    MuiIconModule,
    MuiSelectModule,
  ],
  declarations: [
    MuiPaginationComponent
  ],
  exports: [
    MuiPaginationComponent
  ]
})
export class MuiPaginationModule {
}
