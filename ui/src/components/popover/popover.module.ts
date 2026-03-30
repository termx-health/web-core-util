import {NgModule} from '@angular/core';
import {CoreI18nModule, CoreUtilModule} from '@termx-health/core-util';
import {CommonModule} from '@angular/common';
import {OverlayModule} from '@angular/cdk/overlay';
import {MuiPopoverComponent, MuiPopoverDirective} from './popover.component';


@NgModule({
  imports: [
    CommonModule,
    OverlayModule,

    CoreUtilModule,
    CoreI18nModule
  ],
  declarations: [
    MuiPopoverComponent,
    MuiPopoverDirective
  ],
  exports: [
    MuiPopoverComponent,
    MuiPopoverDirective
  ]
})
export class MuiPopoverModule {
}
