import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {toBoolean} from '@termx-health/core-util';
import {MuiTableComponent} from './table.component';
import {NgChanges} from '../core';


@Component({
  standalone: false,
  selector: 'td[m-table-expand]',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <m-button mShape="circle" mDisplay="link" (mClick)="toggleExpand()">
      <m-icon class="m-expand__icon" [class.rotated_-180]="_expanded" mCode="down"></m-icon>
    </m-button>
    <ng-content></ng-content>
  `,
  host: {
    '[style.width]': `0`
  }
})
export class MuiTableExpandComponent<T> implements OnChanges {
  public static ngAcceptInputType_mExpanded: boolean | string;

  @Input() public mItem: T;
  @Input() public mExpanded: boolean;
  @Output() public mExpandedChange = new EventEmitter<boolean>();

  public _expanded: boolean;

  public constructor(public mTable: MuiTableComponent<T>) {}

  public ngOnChanges(changes: NgChanges<MuiTableExpandComponent<T>>): void {
    const {mExpanded} = changes;
    if (mExpanded) {
      this._expanded = toBoolean(this.mExpanded);
      Promise.resolve().then(() => this._expanded ? this.mTable.expand(this.getItemIndex()) : this.mTable.collapse(this.getItemIndex()));
    }
  }

  public toggleExpand(): void {
    if (this.getItemIndex() !== -1) {
      this._expanded = !this._expanded;
      this.mExpandedChange.emit(this._expanded);
      this._expanded ? this.mTable.expand(this.getItemIndex()) : this.mTable.collapse(this.getItemIndex());
    }
  }

  private getItemIndex(): number {
    return this.mTable._tableData.items.findIndex(i => i.item === this.mItem);
  }
}

