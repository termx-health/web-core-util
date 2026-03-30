import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MuiMenuComponent} from './menu.component';
import {MuiMenuItemComponent} from './menu-item.component';
import {MuiSubMenuComponent} from './submenu.component';
import {MuiCoreModule} from '../core';
import {MuiTooltipModule} from '../tooltip';
import {MuiIconModule} from '../icon';
import {CoreI18nModule, CoreUtilModule} from '@termx-health/core-util';
import {MuiPopoverModule} from '../popover';


@NgModule({
  imports: [
    CommonModule,

    CoreUtilModule,
    CoreI18nModule,

    MuiCoreModule,
    MuiTooltipModule,
    MuiPopoverModule,
    MuiIconModule
  ],
  declarations: [
    MuiMenuComponent,
    MuiMenuItemComponent,
    MuiSubMenuComponent
  ],
  exports: [
    MuiMenuComponent,
    MuiMenuItemComponent,
    MuiSubMenuComponent
  ]
})
export class MuiMenuModule {
}
