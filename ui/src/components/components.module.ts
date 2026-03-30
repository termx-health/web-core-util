import {NgModule} from '@angular/core';


import {MuiAbbreviateModule} from './abbreviate';
import {MuiAlertModule} from './alert';
import {MuiBackendTableModule} from './table-backend';
import {MuiButtonModule, MuiIconButtonModule, MuiInputsModule} from './inputs';
import {MuiCardModule} from './card';
import {MuiCollapsePanelModule} from './collapse-panel';
import {MuiCoreModule} from './core';
import {MuiDateModule} from './date';
import {MuiDividerModule} from './divider';
import {MuiDrawerModule} from './drawer';
import {MuiDropdownModule} from './dropdown';
import {MuiEditableTableModule} from './editable-table';
import {MuiFormModule} from './form';
import {MuiHeaderModule} from './header';
import {MuiIconModule} from './icon';
import {MuiListModule} from './list';
import {MuiMenuModule} from './menu';
import {MuiModalModule} from './modal';
import {MuiNoDataModule} from './no-data';
import {MuiNotificationModule} from './notification';
import {MuiPaginationModule} from './pagination';
import {MuiPopconfirmModule} from './popconfirm';
import {MuiPopoverModule} from './popover';
import {MuiRadioModule} from './radio';
import {MuiSkeletonModule} from './skeleton';
import {MuiSpinnerModule} from './spinner';
import {MuiTableModule} from './table';
import {MuiTagModule} from './tag';
import {MuiTooltipModule} from './tooltip';
import {MuiTreeModule} from './tree';
import {MuiTreeViewModule} from './tree-view';


const MUI_MODULES = [
  MuiAbbreviateModule,
  MuiAlertModule,
  MuiBackendTableModule,
  MuiButtonModule,
  MuiCardModule,
  MuiCollapsePanelModule,
  MuiCoreModule,
  MuiDateModule,
  MuiDividerModule,
  MuiDrawerModule,
  MuiDropdownModule,
  MuiEditableTableModule,
  MuiFormModule,
  MuiHeaderModule,
  MuiIconButtonModule,
  MuiIconModule,
  MuiInputsModule,
  MuiListModule,
  MuiMenuModule,
  MuiModalModule,
  MuiNoDataModule,
  MuiNotificationModule,
  MuiPaginationModule,
  MuiPopconfirmModule,
  MuiPopoverModule,
  MuiRadioModule,
  MuiSkeletonModule,
  MuiSpinnerModule,
  MuiTableModule,
  MuiTagModule,
  MuiTooltipModule,
  MuiTreeModule,
  MuiTreeViewModule,
];

@NgModule({
  imports: MUI_MODULES,
  exports: MUI_MODULES
})
export class MarinaComponentsModule {
}
