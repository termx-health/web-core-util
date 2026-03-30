import {Component, ContentChildren, Input, QueryList} from '@angular/core';
import {MuiFormColDirective} from './form-col.directive';
import {BooleanInput} from '@termx-health/core-util';
import {NzJustify} from 'ng-zorro-antd/grid';

@Component({
  standalone: false,
  selector: 'm-form-row, [m-form-row]',
  template: `
    <div
        class="m-form-row"
        [class.m-form-row--full]="mFull"
        [class.m-form-row--single-col]="columns.length === 1"
        [ngStyle]="{
          rowGap: mRowGap ?? mGap,
          columnGap: mColGap ?? mGap ?? 'var(--gap-default)',
          '--m-form-row-col-count': columns.length
        }"
    >
      <ng-container *ngIf="columns.length > 0">
        <div *ngFor="let column of columns" class="m-form-col">
          <ng-template [ngTemplateOutlet]="column.template"></ng-template>
        </div>
      </ng-container>

      <ng-content></ng-content>
    </div>
  `
})
export class MuiFormRowComponent {
  public static ngAcceptInputType_mFull: boolean | string;

  @Input() public mGap: string;
  @Input() public mRowGap: string;
  @Input() public mColGap: string;
  @Input() public mJustify: NzJustify = 'center';
  @Input() @BooleanInput() public mFull: boolean;

  @ContentChildren(MuiFormColDirective) public columns: QueryList<MuiFormColDirective>;
}
