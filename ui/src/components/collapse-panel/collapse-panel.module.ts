import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MuiCollapsePanelComponent} from './collapse-panel.component';
import {MuiIconModule} from '../icon';


@NgModule({
  imports: [
    CommonModule,
    MuiIconModule
  ],
  declarations: [
    MuiCollapsePanelComponent
  ],
  exports: [
    MuiCollapsePanelComponent
  ]
})
export class MuiCollapsePanelModule {
}
