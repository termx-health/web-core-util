import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ContentChild,
  ContentChildren,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  TrackByFunction,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {BooleanInput, isDefined, isNil, TableData, TableDataItem, toBoolean} from '@termx-health/core-util';
import {MuiTableHeadDirective, MuiTableNoDataDirective, MuiTableRowDirective, MuiTableRowExpandDirective, MuiTrDirective} from './tr.directive';
import {merge, Observable} from 'rxjs';
import {MuiTableSortOrder, MuiThComponent} from './th.component';
import {switchMap} from 'rxjs/operators';
import {NgChanges} from '../core';
import {TableDataSortFn} from '@termx-health/core-util';
import {DEFAULT_TABLE_CONFIG, MuiConfigService, MuiTableConfig} from '../../config';
import {CdkVirtualScrollViewport} from '@angular/cdk/scrolling';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';


@Component({
  standalone: false,
  selector: 'm-table',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: 'table.component.html'
})
export class MuiTableComponent<T> implements OnChanges, AfterContentInit {
  public static ngAcceptInputType_mOutlined: boolean | string;
  public static ngAcceptInputType_mBordered: boolean | string;
  public static ngAcceptInputType_mRounded: boolean | string;
  public static ngAcceptInputType_mLoading: boolean | string;
  public static ngAcceptInputType_mFixed: boolean | string;
  public static ngAcceptInputType_mEnablePagination: boolean | string;
  public static ngAcceptInputType_mManualPagination: boolean | string;
  public static ngAcceptInputType_mHideOnSinglePage: boolean | string;
  public static ngAcceptInputType_mShowPageSizeChanger: boolean | string;
  public static ngAcceptInputType_mShowTotal: boolean | string;
  public static ngAcceptInputType_mVirtualScroll: boolean | string;

  protected _config: MuiTableConfig;

  public _tableData: TableData<T> = new TableData<T>();
  public _trackBy: TrackByFunction<TableDataItem<T>> = (idx, td) => this.mTrackBy(idx, td.item);

  @Input() public mData: T[] = [];
  @Input() @BooleanInput() public mOutlined: boolean;
  @Input() @BooleanInput() public mBordered: boolean;
  @Input() @BooleanInput() public mRounded: boolean;
  @Input() @BooleanInput() public mLoading: boolean;
  @Input() @BooleanInput() public mFixed: boolean;
  @Input() public mSize: 'small' | 'default' = 'default';
  @Input() public mTrackBy: TrackByFunction<T> = (_idx, item: T) => item;

  // virtual scroll
  @Input() @BooleanInput() public mVirtualScroll: boolean;
  @Input() public mVirtualItemSize = 44;
  @Input() public mVirtualViewportHeight = 768;

  // pagination options, everything is ignored if mEnablePagination=false
  @Input() @BooleanInput() public mEnablePagination: boolean;
  @Input() @BooleanInput() public mManualPagination: boolean;
  @Input() @BooleanInput() public mHideOnSinglePage: boolean;

  @Input() @BooleanInput() public mShowPageSizeChanger: boolean;
  @Input() public mPageSizeOptions: number[];
  @Input() @BooleanInput() public mShowTotal: boolean;
  @Input() public mTotal = 1; // ignored when mManualPagination=true
  @Input() public mPageSize = 10;
  @Input() public mPageIndex = 1;
  @Output() public readonly mPageSizeChange = new EventEmitter<number>();
  @Output() public readonly mPageIndexChange = new EventEmitter<number>();

  // sorting
  @Output() public readonly mSortOrderChange = new EventEmitter<{key: string; order: MuiTableSortOrder}>();

  // templates
  @ContentChild(MuiTableHeadDirective) public head?: MuiTableHeadDirective;
  @ContentChild(MuiTableRowDirective) public row?: MuiTableRowDirective;
  @ContentChild(MuiTableRowExpandDirective) public rowExpand?: MuiTableRowExpandDirective;
  @ContentChild(MuiTableNoDataDirective) public noData?: MuiTableNoDataDirective;

  @ContentChildren(MuiTrDirective, {descendants: true}) public tr?: QueryList<MuiTrDirective>;
  @ContentChildren(MuiThComponent, {descendants: true}) public th?: QueryList<MuiThComponent<T>>;


  // virtual scroll
  @ViewChild('virtualScrollViewport') protected virtualScrollViewport: CdkVirtualScrollViewport;
  @ViewChild('virtualScrollTableHead') protected virtualScrollTableHead: ElementRef<HTMLElement>;
  // https://github.com/angular/components/issues/14833
  private virtualScrollWrapperObserver: MutationObserver;


  public constructor(
    private cdr: ChangeDetectorRef,
    private configService: MuiConfigService,
    private destroyRef: DestroyRef
  ) {
    this.updateConfig();
  }

  private updateConfig(): void {
    // fixme: what if method will be public?
    this._config = {
      ...DEFAULT_TABLE_CONFIG,
      ...this.configService.getConfigFor('table'),
    };

    this._config.bordered = isDefined(this.mBordered) ? toBoolean(this.mBordered) : this._config.bordered;
    this._config.outlined = isDefined(this.mOutlined) ? toBoolean(this.mOutlined) : this._config.outlined;
    this._config.rounded = isDefined(this.mRounded) ? toBoolean(this.mRounded) : this._config.rounded;
    this._config.showTotal = isDefined(this.mShowTotal) ? toBoolean(this.mShowTotal) : this._config.showTotal;
    this._config.showPageSizeChanger = isDefined(this.mShowPageSizeChanger) ? toBoolean(this.mShowPageSizeChanger) : this._config.showPageSizeChanger;
    this._config.pageSizeOptions = isDefined(this.mPageSizeOptions) ? this.mPageSizeOptions : this._config.pageSizeOptions;
  }


  public ngOnChanges(changes: NgChanges<MuiTableComponent<T>>): void {
    const {mData, mEnablePagination, mManualPagination, mTotal, mPageSize, mPageIndex, mSize, mVirtualScroll} = changes;
    if (mData) {
      this._tableData.setData(this.mData || []);
    }
    if (mData || mEnablePagination || mManualPagination || mTotal || mPageSize || mPageIndex) {
      this.calcTablePaging();
    }
    if (mSize) {
      // postpone width calculations until size styles get applied
      Promise.resolve().then(() => this.calcFixedCellWidths());
    }

    const {mBordered, mOutlined, mRounded, mShowTotal, mShowPageSizeChanger, mPageSizeOptions} = changes;
    if ([mBordered, mOutlined, mRounded, mShowTotal, mShowPageSizeChanger, mPageSizeOptions].some(c => isDefined(c?.currentValue))) {
      this.updateConfig();
    }

    if (mVirtualScroll) {
      this.setupVirtualScrollTransformOffset();
    }
  }

  public ngAfterContentInit(): void {
    const trColumns$: Observable<QueryList<MuiTrDirective>> = this.tr.changes;
    trColumns$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => {
      this.calcFixedCellWidths();
    });


    const thColumns$: Observable<QueryList<MuiThComponent<T>>> = this.th.changes;
    const thManualColumns$ = thColumns$.pipe(
      switchMap(() => merge(...this.th.map(th => th.manualOrderClick$))),
      takeUntilDestroyed(this.destroyRef)
    );
    thManualColumns$.subscribe(th => {
      this.mSortOrderChange.emit({
        key: th.mColumnKey,
        order: th.sortOrder
      });

      if (th.mSort) {
        this._tableData.sort(th.mSort as TableDataSortFn<T> | string, th.sortOrder);
      }

      this.th.filter(_th => _th !== th).forEach(th => th.clearSortOrder());
      this.cdr.detectChanges();
    });

    this.cdr.detectChanges();
  }


  // front pagination

  private calcTablePaging(): void {
    if (isNil(this._tableData)) {
      return;
    }
    if (this.mEnablePagination && !this.mManualPagination && isDefined(this.mPageSize) && isDefined(this.mPageIndex)) {
      this._tableData.paginate({limit: this.mPageSize, pageIndex: this.mPageIndex});
    } else {
      this._tableData.paginate();
    }
  }

  public onPageSizeChange(pageSize): void {
    this.mPageSize = pageSize;
    this.mPageSizeChange.emit(pageSize);
    this.calcTablePaging();
  }

  public onPageIndexChange(pageIndex): void {
    this.mPageIndex = pageIndex;
    this.mPageIndexChange.emit(pageIndex);
    this.calcTablePaging();
  }

  public get _total(): number {
    return this.mManualPagination ? this.mTotal : this._tableData.total;
  }


  // expendable row

  public expand(rowIndex: number): void {
    this._tableData.get(rowIndex).expanded = true;
  }

  public collapse(rowIndex: number): void {
    this._tableData.get(rowIndex).expanded = false;
  }


  // fixed cells

  private calcFixedCellWidths(): void {
    if (!this.tr) {
      return;
    }

    const data = [
      ...this.tr.filter(tr => tr.fixedCells.some(fc => fc.elementRef.nativeElement?.nodeName === 'TH')).map(tr => [tr]),
      this.tr.filter(tr => tr.fixedCells.some(fc => fc.elementRef.nativeElement?.nodeName === 'TD'))
    ];

    data.filter(d => d.length).forEach((directives) => {
      const firstTr = directives[0];
      if (firstTr.fixedCells.length === 0) {
        return;
      }

      // calculate offsets of the first row
      // todo: add calculation kung fu to take 'colSpan' & 'rowSpan' into account
      const leftCells = firstTr.fixedCells.filter(c => c.isFixedLeft);
      const rightCells = firstTr.fixedCells.filter(c => c.isFixedRight).reverse();
      const leftCellData = leftCells.reduce((acc, c) => ([...acc, acc[acc.length - 1] + c.elementRef.nativeElement.getBoundingClientRect().width]), [0]);
      const rightCellData = rightCells.reduce((acc, c) => ([...acc, acc[acc.length - 1] + c.elementRef.nativeElement.getBoundingClientRect().width]), [-1]);

      // apply offsets on rows
      directives.forEach(tr => {
        tr.fixedCells.filter(c => c.isFixedLeft).forEach((cell, i) => {
          cell.setAutoWidth('left', `${leftCellData[i]}px`);
          cell.setIsLastLeft(i === leftCells.length - 1);
        });

        tr.fixedCells.filter(c => c.isFixedRight).reverse().forEach((cell, i) => {
          cell.setAutoWidth('right', `${rightCellData[i]}px`);
          cell.setIsFirstRight(i === rightCells.length - 1);
        });
      });
    });
  }


  // virtual scroll

  private setupVirtualScrollTransformOffset(): void {
    this.virtualScrollWrapperObserver?.disconnect();
    if (!this.mVirtualScroll) {
      return;
    }

    setTimeout(() => {
      const scrollViewPort = this.virtualScrollViewport.elementRef.nativeElement;
      const scrollWrapper: HTMLElement = scrollViewPort.querySelector(' div.cdk-virtual-scroll-content-wrapper');

      this.virtualScrollWrapperObserver = new MutationObserver(mutations => {
        mutations.forEach(_mutationRecord => {
          const offset = scrollWrapper.style.transform.replace('translateY(', '').replace('px)', '');
          scrollViewPort.style.setProperty('--virtual-scroll-offset', `-${offset}px`);
        });
      });

      this.virtualScrollWrapperObserver.observe(scrollWrapper, {attributes: true, attributeFilter: ['style']});
      this.destroyRef.onDestroy(() => this.virtualScrollWrapperObserver.disconnect());
    });
  }
}
