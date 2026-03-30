import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  DestroyRef,
  Directive,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  QueryList,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {BooleanInput, copyDeep, isDefined, isNil, QueryParams, SearchResult, toBoolean} from '@termx-health/core-util';
import {
  MuiTableComponent,
  MuiTableHeadDirective,
  MuiTableNoDataDirective,
  MuiTableRowDirective,
  MuiTableRowExpandDirective,
  MuiTableSortOrder,
  MuiThComponent,
  MuiTrDirective
} from '../table';
import {NgChanges} from '../core';
import {DEFAULT_TABLE_CONFIG, MuiConfigService, MuiTableConfig} from '../../config';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';


/*
 * Current m-table implementation relies on structural directives.
 * When structural directives are drawn outside m-table's tags and injected via <ng-content> the @ContentChild(ren) of m-table cannot query the content!
 * We trick the m-table by querying mandatory directive and just forwarding them to m-table.

 * FIXME: ideally the successor/implementer of m-table shouldn't do this!
 */
@Directive()
abstract class MuiBackendBaseTableComponent<T> {
  public static ngAcceptInputType_mShowTotal: boolean | string;
  public static ngAcceptInputType_mShowPageSizeChanger: boolean | string;
  public static ngAcceptInputType_mOutlined: boolean | string;
  public static ngAcceptInputType_mBordered: boolean | string;
  public static ngAcceptInputType_mRounded: boolean | string;
  public static ngAcceptInputType_mLoading: boolean | string;

  protected _config: MuiTableConfig;

  @Input() @BooleanInput() public mLoading: boolean;
  @Input() @BooleanInput() public mBordered: boolean;
  @Input() @BooleanInput() public mOutlined: boolean;
  @Input() @BooleanInput() public mRounded: boolean;
  @Input() @BooleanInput() public mShowTotal: boolean;
  @Input() @BooleanInput() public mShowPageSizeChanger: boolean;
  @Input() public mPageSizeOptions: number[];
  @Input() public mSize: 'small' | 'default' = 'default';

  @ViewChild('mTable') public table: MuiTableComponent<T>;
  @ContentChild(MuiTableHeadDirective) public head?: MuiTableHeadDirective;
  @ContentChild(MuiTableRowDirective) public row?: MuiTableRowDirective;
  @ContentChild(MuiTableRowExpandDirective) public rowExpand?: MuiTableRowExpandDirective;
  @ContentChild(MuiTableNoDataDirective) public noData?: MuiTableNoDataDirective;
  @ContentChildren(MuiTrDirective, {descendants: true}) public tr?: QueryList<MuiTrDirective>;
  @ContentChildren(MuiThComponent, {descendants: true}) public th?: QueryList<MuiThComponent<T>>;

  protected constructor(private config: MuiConfigService) {
    this.updateConfig();
  }

  protected initTable(): void {
    this.table.head = this.head;
    this.table.row = this.row;
    this.table.rowExpand = this.rowExpand;
    this.table.noData = this.noData;
    this.table.tr = this.tr;
    this.table.th = this.th;
    this.table.ngAfterContentInit();
  }

  protected updateConfig(): void {
    this._config = {
      ...DEFAULT_TABLE_CONFIG,
      ...this.config.getConfigFor('table'),
    };

    this._config.bordered = isDefined(this.mBordered) ? toBoolean(this.mBordered) : this._config.bordered;
    this._config.outlined = isDefined(this.mOutlined) ? toBoolean(this.mOutlined) : this._config.outlined;
    this._config.rounded = isDefined(this.mRounded) ? toBoolean(this.mRounded) : this._config.rounded;
    this._config.showTotal = isDefined(this.mShowTotal) ? toBoolean(this.mShowTotal) : this._config.showTotal;
    this._config.showPageSizeChanger = isDefined(this.mShowPageSizeChanger) ? toBoolean(this.mShowPageSizeChanger) : this._config.showPageSizeChanger;
    this._config.pageSizeOptions = isDefined(this.mPageSizeOptions) ? this.mPageSizeOptions : this._config.pageSizeOptions;
  }
}


export function tableFactory<T>(backendTable: MuiBackendTableComponent<T>): MuiTableComponent<T> {
  return backendTable.table;
}

@Component({
  standalone: false,
  selector: 'm-backend-table',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: MuiTableComponent,
      useFactory: tableFactory,
      deps: [MuiBackendTableComponent]
    }
  ],
  template: `
    <m-table
      #mTable
      [mData]="mResult.data"

      [mTotal]="mResult.meta.total"
      [(mPageSize)]="mQuery.limit"
      [(mPageIndex)]="mQuery.page"
      mEnablePagination
      mManualPagination

      [mShowPageSizeChanger]="_config.showPageSizeChanger"
      [mPageSizeOptions]="_config.pageSizeOptions"
      (mPageSizeChange)="onPageSizeChange()"
      (mPageIndexChange)="onPageIndexChange()"
      (mSortOrderChange)="onSortOrderChange($event.key, $event.order)"

      [mSize]="mSize"
      [mLoading]="mLoading"
      [mOutlined]="_config.outlined"
      [mBordered]="_config.bordered"
      [mRounded]="_config.rounded"
      [mShowTotal]="_config.showTotal"
    >
      <ng-content tableHeader select="[tableHeader]"></ng-content>
      <ng-content></ng-content>
    </m-table>
  `
})
export class MuiBackendTableComponent<T> extends MuiBackendBaseTableComponent<T> implements OnChanges, AfterViewInit {
  @Input() public mResult: SearchResult<T> = SearchResult.empty();
  @Input() public mQuery: QueryParams = new QueryParams();
  @Output() public mQueryChange: EventEmitter<QueryParams> = new EventEmitter<QueryParams>();

  private sortMap: {[key: string]: MuiTableSortOrder} = {};

  public constructor(
    configService: MuiConfigService,
    private destroyRef: DestroyRef
  ) {
    super(configService);
  }


  public ngOnChanges(changes: NgChanges<MuiBackendTableComponent<T>>): void {
    const {mQuery, mBordered, mOutlined, mRounded, mShowTotal} = changes;
    if (mQuery) {
      this.readSort();
    }

    if ([mBordered, mOutlined, mRounded, mShowTotal].some(c => isDefined(c?.currentValue))) {
      this.updateConfig();
    }
  }

  public ngAfterViewInit(): void {
    this.initTable();
    this.th.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.applySort());
  }


  protected onPageSizeChange(): void {
    this.mQuery.offset = 0;
    this.loadData();
  }

  protected onPageIndexChange(): void {
    this.loadData();
  }

  protected onSortOrderChange(key: string, order: MuiTableSortOrder): void {
    this.mQuery.sort = undefined;
    if (order) {
      this.mQuery.sort = order === 'descend' ? `-${key}` : key;
    }
    this.loadData();
  }


  private loadData(): void {
    this.mQueryChange.emit(Object.assign(new QueryParams(), copyDeep(this.mQuery)));
  }


  private readSort(): void {
    if (isNil(this.mQuery) || isNil(this.mQuery.sort)) {
      return;
    }

    this.sortMap = {};
    const sortToken: string = Array.isArray(this.mQuery.sort) ? this.mQuery.sort[0] : this.mQuery.sort; // multicolumn sort is not supported
    if (isNil(sortToken)) {
      return;
    }

    const desc = sortToken.startsWith('-');
    const key = desc ? sortToken.substring(1) : sortToken;
    this.sortMap[key] = desc ? 'descend' : 'ascend';
  }

  private applySort(): void {
    Promise.resolve().then(() => {
      this.th?.filter(th => !!this.sortMap[th.mColumnKey]).forEach(th => {
        th.setSortOrder(this.sortMap[th.mColumnKey]);
      });
    });
  }
}

