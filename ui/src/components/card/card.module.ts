import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MuiCardComponent, MuiCardContentDirective, MuiCardFooterDirective, MuiCardHeaderDirective} from './card.component';
import {CoreI18nModule} from '@termx-health/core-util';
import {MuiSkeletonModule} from '../skeleton';


@NgModule({
  imports: [
    CommonModule,
    CoreI18nModule,
    MuiSkeletonModule
  ],
  declarations: [
    MuiCardComponent,
    MuiCardHeaderDirective,
    MuiCardContentDirective,
    MuiCardFooterDirective
  ],
  exports: [
    MuiCardComponent,
    MuiCardHeaderDirective,
    MuiCardContentDirective,
    MuiCardFooterDirective
  ]
})
export class MuiCardModule {
}
