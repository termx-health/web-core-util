import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MuiScrollableDirective} from './scrollable.directive';
import {MuiBreakpointService} from './breakpoint.service';
import {MuiLinkDirective} from './a.directive';


@NgModule({
  imports: [
    CommonModule,
  ],
  declarations: [
    MuiScrollableDirective,
    MuiLinkDirective
  ],
  exports: [
    MuiScrollableDirective,
    MuiLinkDirective
  ],
  providers: [
    MuiBreakpointService
  ]
})
export class MuiCoreModule {
}
