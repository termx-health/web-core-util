import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {CoreI18nModule, CoreUtilModule} from '@termx-health/core-util';
import {MuiDrawerComponent} from './drawer.component';
import {CoreZorroModule} from '../../zorro';
import {A11yModule} from '@angular/cdk/a11y';


@NgModule({
  imports: [
    CommonModule,
    A11yModule,

    CoreUtilModule,
    CoreI18nModule,

    CoreZorroModule,
  ],
  declarations: [
    MuiDrawerComponent
  ],
  exports: [
    MuiDrawerComponent
  ]
})
export class MuiDrawerModule {
}
