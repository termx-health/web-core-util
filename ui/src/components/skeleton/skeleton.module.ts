import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MuiSkeletonComponent} from './skeleton.component';
import {CoreZorroModule} from '../../zorro';
import {CoreUtilModule} from '@termx-health/core-util';


@NgModule({
  imports: [
    CommonModule,
    CoreUtilModule,
    CoreZorroModule
  ],
  declarations: [
    MuiSkeletonComponent
  ],
  exports: [
    MuiSkeletonComponent
  ]
})
export class MuiSkeletonModule {
}
