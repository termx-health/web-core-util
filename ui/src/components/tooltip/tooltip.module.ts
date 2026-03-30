import {NgModule} from '@angular/core';
import {CoreI18nModule, CoreUtilModule} from '@termx-health/core-util';
import {CommonModule} from '@angular/common';
import {OverlayModule} from '@angular/cdk/overlay';
import {MuiTooltipComponent, MuiTooltipDirective} from './tooltip.component';


@NgModule({
  imports: [
    CommonModule,
    OverlayModule,

    CoreUtilModule,
    CoreI18nModule,
  ],
  declarations: [
    MuiTooltipComponent,
    MuiTooltipDirective
  ],
  exports: [
    MuiTooltipComponent,
    MuiTooltipDirective
  ]
})
export class MuiTooltipModule {
}
