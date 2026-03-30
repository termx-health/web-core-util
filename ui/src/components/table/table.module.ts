import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MuiTableComponent} from './table.component';
import {MuiTableCellFixedDirective} from './table-fixed-cell.directive';
import {MuiTableExpandComponent} from './table-expand.component';
import {MuiTableHeadDirective, MuiTableNoDataDirective, MuiTableRowDirective, MuiTableRowExpandDirective, MuiTrDirective} from './tr.directive';
import {MuiTableSortersComponent} from './table-sorter.component';
import {MuiThComponent} from './th.component';
import {CoreI18nModule} from '@termx-health/core-util';
import {MuiPaginationModule} from '../pagination';
import {MuiSpinnerModule} from '../spinner';
import {MuiIconModule} from '../icon';
import {MuiButtonModule} from '../inputs';
import {ScrollingModule} from '@angular/cdk/scrolling';
import {MuiCoreModule} from '../core';


@NgModule({
  imports: [
    CommonModule,
    ScrollingModule,

    CoreI18nModule,

    MuiCoreModule,
    MuiPaginationModule,
    MuiSpinnerModule,
    MuiIconModule,
    MuiButtonModule,
  ],
  declarations: [
    MuiTableCellFixedDirective,
    MuiTableComponent,
    MuiTableExpandComponent,
    MuiTableHeadDirective,
    MuiTableNoDataDirective,
    MuiTableRowDirective,
    MuiTableRowExpandDirective,
    MuiTableSortersComponent,
    MuiThComponent,
    MuiTrDirective,
  ],
  exports: [
    MuiTableCellFixedDirective,
    MuiTableComponent,
    MuiTableExpandComponent,
    MuiTableHeadDirective,
    MuiTableNoDataDirective,
    MuiTableRowDirective,
    MuiTableRowExpandDirective,
    MuiTableSortersComponent,
    MuiThComponent,
    MuiTrDirective,
  ],
})
export class MuiTableModule {
}
