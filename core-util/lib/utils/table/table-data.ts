import {isNil} from '../object/object.util';
import {sort} from '../array/sort.util';

export type TableDataSortOrder = string | 'ascend' | 'descend' | null;
export type TableDataSortFn<T = unknown> = (a: T, b: T, order?: TableDataSortFn) => number;

export class TableDataItem<T> {
  public item: T;
  public expanded: boolean = false;

  public constructor(item: T) {
    this.item = item;
  }
}

export class TableData<T> {
  public raw: T[] = [];
  public items: TableDataItem<T>[] = [];

  private _sortOptions: {
    sortFn?: TableDataSortFn<T> | string | null,
    sortOrder?: TableDataSortOrder
  } = {};

  private _paginationOptions: {
    limit?: number,
    pageIndex?: number
  } = {};

  public constructor(data?: T[]) {
    if (data) {
      this.setData(data);
    }
  }

  // Getters

  public get(index: number): TableDataItem<T> {
    return this.items[index];
  }

  public get length(): number {
    return this.items?.length || 0;
  }

  public get total(): number {
    return this.raw?.length || 0;
  }

  public get pageIndex(): number {
    return this._paginationOptions?.pageIndex || 1;
  }

  public get pageSize(): number {
    return this._paginationOptions?.limit || this.total;
  }


  // Public methods

  public setData(data: T[]): void {
    this.raw = data;
    this.createView();
  }

  public sort(fn: TableDataSortFn<T> | string | null, order: TableDataSortOrder): void {
    this._sortOptions = {sortFn: fn, sortOrder: order};
    this.createView();
  }

  public paginate(options?: {limit: number, pageIndex: number}): void {
    this._paginationOptions = options || {};
    this.createView();
  }


  // Helpers

  private createView(): void {
    this.items = this.raw.map(d => new TableDataItem(d));
    this.applySort();
    this.applyPagination();
  }

  private applySort(): void {
    const {sortFn, sortOrder} = this._sortOptions || {};
    if (isNil(sortFn) || isNil(sortOrder)) {
      return;
    }
    if (typeof sortFn === 'string') {
      this.items = sort(this.items, `item.${sortFn}`, sortOrder === 'ascend');
    } else if (typeof sortFn === 'function') {
      // @ts-ignore
      this.items = this.items.sort((a, b) => sortFn(a.item, b.item, sortOrder));
    }
  }

  private applyPagination(): void {
    const {pageIndex, limit} = this._paginationOptions || {};
    if (isNil(pageIndex) || isNil(limit)) {
      return;
    }
    const idx = pageIndex - 1;
    this.items = this.items.slice(limit * idx, (limit * idx) + limit);
  }
}


export function getOrderDirection(sortDirections: TableDataSortOrder[], current: TableDataSortOrder): TableDataSortOrder {
  const index = sortDirections.indexOf(current);
  return index + 1 < sortDirections.length ? sortDirections[index + 1] : sortDirections[0];
}
