import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  Output,
  ViewEncapsulation
} from '@angular/core';
import {fromEvent, Subject} from 'rxjs';
import {filter} from 'rxjs/operators';
import {BooleanInput} from '@termx-health/core-util';
import {NgChanges} from '../core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

export type MuiTableSortOrder = string | 'ascend' | 'descend' | null;
export type MuiTableSortFn<T = unknown> = (a: T, b: T, order?: MuiTableSortOrder) => number;

@Component({
  standalone: false,
  selector: 'th[mHideSort], th[mColumnKey], th[mSort], th[mSortOrder]',
  preserveWhitespaces: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-template [ngTemplateOutlet]="mHideSort?contentTemplate:sortTemplate"></ng-template>

    <ng-template #sortTemplate>
      <m-table-sorters
          [mSortOrder]="sortOrder"
          [mSortDirections]="mSortDirections"
          [mContentTemplate]="contentTemplate"
      ></m-table-sorters>
    </ng-template>

    <ng-template #contentTemplate>
      <ng-content></ng-content>
    </ng-template>
  `,
  host: {
    '[class.m-table-column-sortable]': '!mHideSort',
    '[class.m-table-column-sorted]': `sortOrder === 'descend' || sortOrder === 'ascend'`
  }
})
export class MuiThComponent<T> implements OnChanges, OnInit {
  public static ngAcceptInputType_mHideSort: boolean | string;

  public readonly manualOrderClick$ = new Subject<MuiThComponent<T>>();
  public sortOrder: MuiTableSortOrder = null;

  @Input() public mColumnKey: string | null = null; // backend sort
  @Input() public mSort: MuiTableSortFn<T> | string | null = null; // frontend sort
  @Input() public mSortOrder: MuiTableSortOrder | null = null;
  @Input() public mSortDirections: MuiTableSortOrder[] = ['ascend', 'descend', null];
  @Input() @BooleanInput() public mHideSort: boolean;

  @Output() public readonly mSortOrderChange = new EventEmitter<string | null>();

  public constructor(
    private host: ElementRef<HTMLElement>,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private destroyRef: DestroyRef
  ) {}


  public ngOnChanges(changes: NgChanges<MuiThComponent<T>>): void {
    const {mSortOrder} = changes;
    if (mSortOrder) {
      this.setSortOrder(this.mSortOrder);
    }
  }

  public ngOnInit(): void {
    fromEvent(this.host.nativeElement, 'click')
      .pipe(takeUntilDestroyed(this.destroyRef), filter(() => !this.mHideSort))
      .subscribe(() => {
        const nextOrder = this.getOrderDirection(this.mSortDirections, this.sortOrder!);
        this.ngZone.run(() => {
          this.setSortOrder(nextOrder);
          this.manualOrderClick$.next(this);
        });
      });

  }


  public setSortOrder(order: MuiTableSortOrder | null): void {
    if (this.sortOrder !== order) {
      this.sortOrder = order;
      this.mSortOrderChange.emit(order);
      this.cdr.markForCheck();
    }
  }

  public clearSortOrder(): void {
    if (this.sortOrder !== null) {
      this.setSortOrder(null);
    }
  }

  private getOrderDirection(sortDirections: MuiTableSortOrder[], current: MuiTableSortOrder): MuiTableSortOrder {
    const index = sortDirections.indexOf(current);
    return index + 1 < sortDirections.length ? sortDirections[index + 1] : sortDirections[0];
  }
}
