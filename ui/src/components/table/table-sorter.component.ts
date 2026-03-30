import {ChangeDetectionStrategy, Component, Input, OnChanges, TemplateRef, ViewEncapsulation} from '@angular/core';
import {NgChanges} from '../core';

@Component({
  standalone: false,
  selector: 'm-table-sorters',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <span class="m-table-column-title">
      <ng-template [ngTemplateOutlet]="mContentTemplate"></ng-template>
    </span>

    <span class="m-table-column-sorter" [class.m-table-column-sorter-full]="isDown && isUp">
      <span class="m-table-column-sorter-inner">
        <m-icon mCode="caret-up" class="m-table-column-sorter-up" [class.active]="mSortOrder === 'ascend'" *ngIf="isUp"></m-icon>
        <m-icon mCode="caret-down" class="m-table-column-sorter-down" [class.active]="mSortOrder === 'descend'" *ngIf="isDown"></m-icon>
      </span>
    </span>
  `,
  host: {class: 'm-table-column-sorters'}
})
export class MuiTableSortersComponent implements OnChanges {
  @Input() public mSortDirections: string[] = ['ascend', 'descend', null];
  @Input() public mSortOrder: string = null;
  @Input() public mContentTemplate: TemplateRef<any> | null = null;

  public isUp = false;
  public isDown = false;

  public ngOnChanges(changes: NgChanges<MuiTableSortersComponent>): void {
    const {mSortDirections} = changes;
    if (mSortDirections) {
      this.isUp = this.mSortDirections.indexOf('ascend') !== -1;
      this.isDown = this.mSortDirections.indexOf('descend') !== -1;
    }
  }
}
