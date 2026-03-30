import {ContentChildren, Directive, ElementRef, QueryList, TemplateRef} from '@angular/core';
import {MuiTableCellFixedDirective} from './table-fixed-cell.directive';


@Directive({
  standalone: false,selector: 'tr'})
export class MuiTrDirective {
  @ContentChildren(MuiTableCellFixedDirective) public fixedCells?: QueryList<MuiTableCellFixedDirective>;

  public constructor(public elementRef: ElementRef) {}
}

@Directive()
class MuiTableTemplateBaseDirective {
  public constructor(public template: TemplateRef<any>) { }
}

@Directive({
  standalone: false,selector: '[mTableHead]'})
export class MuiTableHeadDirective extends MuiTableTemplateBaseDirective {
}

@Directive({
  standalone: false,selector: '[mTableRow]'})
export class MuiTableRowDirective extends MuiTableTemplateBaseDirective {
}

@Directive({
  standalone: false,selector: '[mTableRowExpand]'})
export class MuiTableRowExpandDirective extends MuiTableTemplateBaseDirective {
  // No class is applied on directive host.
  // Style row yourself or apply 'm-table-expanded-row' class for default styling.
}

@Directive({
  standalone: false,selector: '[mTableNoData]'})
export class MuiTableNoDataDirective extends MuiTableTemplateBaseDirective {
}
