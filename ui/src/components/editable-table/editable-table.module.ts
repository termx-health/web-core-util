import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MuiTableModule} from '../table';
import {MuiEditableTableComponent} from './editable-table.component';
import {MuiEditableTableColumnComponent} from './editable-table-column.component';
import {CoreI18nModule, CoreUtilModule} from '@termx-health/core-util';
import {MuiIconModule} from '../icon';
import {MuiPopconfirmModule} from '../popconfirm';
import {MuiNoDataModule} from '../no-data';
import {MuiFormModule} from '../form';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {HotkeyModule} from 'angular2-hotkeys';


@NgModule({
  imports: [
    CommonModule,
    ScrollingModule,
    HotkeyModule.forRoot(),

    CoreUtilModule,
    CoreI18nModule,

    MuiTableModule,
    MuiIconModule,
    MuiPopconfirmModule,
    MuiNoDataModule,
    MuiFormModule,
  ],
  declarations: [
    MuiEditableTableComponent,
    MuiEditableTableColumnComponent,
  ],
  exports: [
    MuiEditableTableComponent,
    MuiEditableTableColumnComponent,
  ]
})
export class MuiEditableTableModule {
}
