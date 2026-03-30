import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MuiNoDataComponent} from './no-data.component';
import {CoreI18nModule} from '@termx-health/core-util';


@NgModule({
  imports: [
    CommonModule,
    CoreI18nModule
  ],
  declarations: [
    MuiNoDataComponent
  ],
  exports: [
    MuiNoDataComponent
  ],
})
export class MuiNoDataModule {
}
