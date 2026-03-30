import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  DestroyRef,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  QueryList,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {map, Observable, startWith, timer} from 'rxjs';
import {NgForm} from '@angular/forms';
import {BooleanInput, copyDeep, findFocusableElement, group, isDefined, markAsDirty, markAsPristine, remove, sort} from '@termx-health/core-util';
import {v4 as uuid} from 'uuid';
import {NgChanges} from '../core';
import {NzFormStatusService} from 'ng-zorro-antd/core/form';
import {MuiTableComponent, MuiTableSortOrder} from '../table';
import {MuiEditableTableColumnComponent} from './editable-table-column.component';
import {MuiEditableFlexTableHotkeysManager} from './editable-flex-table-hotkeys-manager.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';


@Component({
  standalone: false,
  selector: 'm-editable-table',
  templateUrl: 'editable-table.component.html',
  providers: [NzFormStatusService]
})
export class MuiEditableTableComponent<T = unknown> implements OnChanges, OnInit, AfterContentInit {
  public static ngAcceptInputType_mAddAllowed: boolean | string;
  public static ngAcceptInputType_mDeleteAllowed: boolean | string;
  public static ngAcceptInputType_mEditAllowed: boolean | string;
  public static ngAcceptInputType_mLoading: boolean | string;
  public static ngAcceptInputType_mShowExpandButton: boolean | string;
  public static ngAcceptInputType_mRowEditAllowed: <T>(item: T) => boolean;
  public static ngAcceptInputType_mRowDeleteAllowed: <T>(item: T) => boolean;
  public static ngAcceptInputType_mValidateOnFocus: boolean | string;
  public static ngAcceptInputType_mVirtualScroll: boolean | string;

  @Input() public mData: T[];

  @Input() public mRowInstance: ((previousRow: T) => Observable<T>) | T;
  @Input() @BooleanInput() public mAddAllowed: boolean = true;
  @Input() @BooleanInput() public mEditAllowed: boolean = true;
  @Input() @BooleanInput() public mDeleteAllowed: boolean = true;
  @Input() public mRowEditAllowed: (item: T, _ngTrigger?: any) => boolean = () => !!this.mEditAllowed;
  @Input() public mRowDeleteAllowed: (item: T, _ngTrigger?: any) => boolean = () => !!this.mDeleteAllowed;

  @Input() @BooleanInput() public mValidateOnFocus: boolean = true;
  @Input() public mValidateFn: () => boolean;
  // @Input() public mFilterFn: (item: T, text: string) => boolean;

  @Input() @BooleanInput() public mVirtualScroll: boolean;
  @Input() public mVirtualItemSize = 56;
  @Input() public mVirtualViewportHeight = 768;

  @Input() @BooleanInput() public mShowExpandButton: boolean = true;
  @Input() @BooleanInput() public mLoading: boolean;

  @Output() public mRowAdd = new EventEmitter<T>();
  @Output() public mRowEdit = new EventEmitter<T>();
  @Output() public mRowExpand = new EventEmitter<T>();
  @Output() public mAfterDelete = new EventEmitter<T>();
  @Output() public mAfterSubmit = new EventEmitter<T>();
  @Output() public mSortChange = new EventEmitter<string>();

  @ContentChild('headTemplate') public headTemplate: TemplateRef<any>;
  @ContentChildren(MuiEditableTableColumnComponent) public columns: QueryList<MuiEditableTableColumnComponent>;
  @ContentChild('expandEditTemplate') public expandEditTemplate: TemplateRef<any>;
  @ContentChild('expandViewTemplate') public expandViewTemplate: TemplateRef<any>;

  @ViewChild(MuiTableComponent, {read: ElementRef}) private table: ElementRef;

  public constructor(
    protected mForm: NgForm,
    private elementRef: ElementRef,
    private hotkeysManager: MuiEditableFlexTableHotkeysManager<T>,
    private destroyRef: DestroyRef
  ) { }

  protected _data: TableData<T>;
  protected _columns: MuiEditableTableColumnComponent[] = [];
  protected _item: TableDataItem<T>;
  protected _deleteCandidateIdx: number;


  public ngOnChanges(changes: NgChanges<MuiEditableTableComponent<T>>): void {
    const {mData, mEditAllowed} = changes;
    if (mData && this.mData) {
      this._data = new TableData(this.mData);
      this._item = null;
    }

    if (mEditAllowed && !this.mEditAllowed) {
      this.submitActiveRow();
      this._item = null;
    }
  }

  public ngOnInit(): void {
    this.elementRef.nativeElement.addEventListener('focusout', e => {
      if (!this.elementRef.nativeElement.contains(e.relatedTarget)) {
        this.hotkeysManager.detach();
      }
    });
  }

  public ngAfterContentInit(): void {
    this.columns.changes.pipe(
      takeUntilDestroyed(this.destroyRef),
      startWith(this.columns)
    ).subscribe((cols: QueryList<MuiEditableTableColumnComponent>) => {
      const columns = cols.filter(c => !c.mOrder);
      cols.filter(c => !!c.mOrder).forEach(col => columns.splice(col.mOrder - 1, 0, col));
      this._columns = columns;
    });
  }


  /* Validation */

  protected isValid(): boolean {
    return this._data.items.every(i => i.valid);
  }

  protected cleanup(): void {
    this._data.items.filter(i => i.pristine).forEach(i => this._data.remove(i));
  }


  /* External API */

  public editRow(idx: number, columnName?: string): void {
    const item = this._data.getByIndex(idx);
    if (item) {
      const column = columnName ?? this.getEditableColumns(item.item)[0].mName;
      this.startRowEdit(item.uid, item.columnName(column));
    }
  }

  public removeRow(idx: number): void {
    this.deleteRow(this._data.items[idx]?.uid);
  }

  public appendRow(obj: T, focus?: boolean): void {
    this._appendRow(obj, focus);
  }

  public initRow(focus: boolean): void {
    this._initRow(focus);
  }


  public validate(): boolean {
    if (this.mForm) {
      markAsDirty(this.mForm);
    }
    if (this.mEditAllowed) {
      this.submitActiveRow();
    }
    this._data.items.forEach(i => i.pristine = false);
    return this.isValid();
  }

  public validateAndCleanup(): boolean {
    this.submitEditRow();
    this.cleanup();
    return this.validate();
  }


  public markAsInvalid(idx: number): void {
    const tdi = this._data.items[idx];
    if (tdi) {
      tdi.pristine = false;
      tdi.valid = false;
    }
  }


  /* Internal API */

  protected startRowEdit(uid: string, controlName: string, userClick = false): void {
    if (this.mLoading || !this.mEditAllowed || !this._data.get(uid) || !this.mRowEditAllowed(this._data.get(uid).item)) {
      return;
    }

    if (this._item?.uid !== uid) {
      // submit previous row
      this.submitEditRow();
    }

    // set row as valid. validation is done later, when all inputs are rendered
    this._data.get(uid).valid = true;

    // xxx sometimes angular initializes new row before it destroys previous row
    // setTimeout(() => {
    const tdi = this._item = this._data.get(uid);
    this.mRowEdit.emit(tdi.item);

    this.setFocus(controlName, true, userClick).subscribe(() => {
      if (tdi.pristine) {
        markAsPristine(this.mForm);
      } else if (this.mForm && !this.mForm.valid && this.mValidateOnFocus) {
        markAsDirty(this.mForm);
      }
    });
    // });
  }

  protected cancelRowEdit(): void {
    if (this.mLoading) {
      return;
    }
    this.submitEditRow();
    this._item = null;
  }

  protected deleteRow(uid: string): void {
    if (this.mLoading || !this.mEditAllowed || !this.mDeleteAllowed) {
      return;
    }

    const tdi = this._data.removeByUid(uid);
    this.mAfterDelete.emit(tdi.item);
    this.submitEditRow();

    if (!this._data.length) {
      this.focusout();
    }
  }

  protected _appendRow(row: T, focus?: boolean): void {
    this.submitEditRow();

    const tdi = this._data.add(row);
    tdi.pristine = true;
    markAsPristine(this.mForm);

    if (focus) {
      const editableColumns = this.getEditableColumns(row);
      this.startRowEdit(tdi.uid, tdi.columnName(editableColumns[0]?.mName));
    }
  }

  protected _initRow(focus: boolean): void {
    if (!this.mAddAllowed) {
      return;
    }

    if (this.mRowAdd.observed) {
      // user handles externally how new row is added to mData
      this.mRowAdd.emit(null);
      return;
    }

    if (this.mRowInstance && typeof this.mRowInstance === 'function') {
      const _rowInitializer = this.mRowInstance as ((previousRow: T) => Observable<T>);

      _rowInitializer(this._data.last?.item).subscribe(row => {
        if (row) {
          this._appendRow(row, focus);
        }
      });
    } else if (this.mRowInstance) {
      const _row = copyDeep(this.mRowInstance as T);
      this._appendRow(_row, focus);
    } else {
      this._appendRow({} as T, focus);
    }

    if (this.mVirtualScroll) {
      // todo: setTimeout(() => this.scrollToBottom());
    }
  }


  private submitEditRow(): void {
    if (this.mEditAllowed) {
      this.submitActiveRow();
      this._item = null;
    }
  }

  private submitActiveRow(): void {
    this.submitRow(this._item?.uid);
  }

  private submitRow(uid: string): void {
    const item = this._data.get(uid);
    if (!item) {
      return;
    }

    item.pristine = this.mForm.pristine && item.pristine;
    if (this.mValidateFn) {
      item.valid = this.mValidateFn();
    } else if (this.mForm) {
      item.valid = this.mForm.valid;
    }

    this.mAfterSubmit.emit(item.item);
  }

  protected toggleExpand(uid: string): void {
    if (this._item?.uid === uid) {
      this.submitEditRow();
      this._item = null;
    } else {
      this.startRowEdit(uid, null);
      this._item = this._data.get(uid);
    }
  }


  /* Sort */

  protected sortData(sortKey: string, order: MuiTableSortOrder): void {
    if (!sortKey) {
      return;
    }
    if (this._item) {
      this.submitEditRow();
    }
    this.mSortChange.emit(sortKey + '|' + order);
    this._data.sort(sortKey, order === 'ascend');
  }


  /* Keyboard navigation */

  public navigateArrows(position: {row: number, col: number}, delta: {row: -1 | 0 | 1, col: -1 | 0 | 1}, appendIfMissing = true): void {
    const {row: currentRow, col: currentCol} = position;
    const {row: deltaRow, col: deltaCol} = delta;


    const nextColIdx = currentCol + deltaCol;
    let nextRowIdx;

    if (deltaRow === 0) {
      nextRowIdx = currentRow;

      // If commanded to navigate on the same row, check whether the row is still editable
      // It may be deleted or modified that mRowEditAllowed would produce false
      const item = this._data.getByIndex(nextRowIdx)?.item;
      const isRowEditable = isDefined(item) && this.mRowEditAllowed(item);
      if (!isRowEditable) {
        // If possible, navigate upwards, if not, downwards
        nextRowIdx =
          this.getNextEditableRowIndex(currentRow, -1) ??
          this.getNextEditableRowIndex(currentRow, 1);
      }
    } else {
      nextRowIdx = this.getNextEditableRowIndex(currentRow, deltaRow) ?? currentRow + deltaRow;
    }


    if (nextColIdx < 0 || this._columns.length < nextColIdx || nextRowIdx < 0) {
      return;
    }

    if (this._data.length <= nextRowIdx && appendIfMissing) {
      this._initRow(false);
    }

    const nextRowItem = this._data.getByIndex(nextRowIdx);
    if (nextRowItem) {
      const nextRowColumns = this._columns.map(c => nextRowItem.columnName(c.mName));
      const nextRowControls = this.getEditableColumns(nextRowItem.item).map(c => nextRowItem.columnName(c.mName));

      if (this._item !== nextRowItem) {
        this.startRowEdit(nextRowItem.uid, nextRowColumns[nextColIdx]);
        return;
      }

      const focusColName = nextRowControls[nextRowControls.indexOf(nextRowColumns[currentCol]) + deltaCol];
      if (focusColName) {
        document.body.click();
        this.setFocus(focusColName, deltaCol >= 0).subscribe();
      }
    }
  }

  public navigateTab(currentRow: number, currentCol: number, deltaCol: -1 | 1): void {
    const currentRowItem = this._data.getByIndex(currentRow);
    const currentRowEditableColumns = this._columns.map(c => this.isCellEditable(c, currentRowItem.item) && c.columnEditVisible);
    const isInBounds = (): boolean =>
      currentCol + deltaCol <= currentRowEditableColumns.lastIndexOf(true) &&
      currentCol + deltaCol >= currentRowEditableColumns.indexOf(true);


    const nextColIdx = currentCol + deltaCol;
    const nextRowIdx = isInBounds() ? currentRow : this.getNextEditableRowIndex(currentRow, deltaCol);
    const nextRowItem = this._data.getByIndex(nextRowIdx);

    const nextRowControls = nextRowItem ? this.getEditableColumns(nextRowItem.item).map(col => nextRowItem.columnName(col.mName)) : [];
    const nextRowEditableColumns = nextRowItem ? this._columns.map(c => this.isCellEditable(c, nextRowItem.item)) : [];


    if (nextColIdx < nextRowEditableColumns.indexOf(true) && nextRowIdx >= 0) {
      this.startRowEdit(nextRowItem.uid, nextRowControls[nextRowControls.length - 1]);
      return;
    }
    if (nextColIdx > nextRowEditableColumns.lastIndexOf(true)) {
      if (nextRowIdx < this._data.length) {
        this.startRowEdit(nextRowItem.uid, nextRowControls[0]);
      } else {
        this._initRow(true);
      }
      return;
    }

    this.navigateArrows({row: currentRow, col: currentCol}, {row: 0, col: deltaCol});
  }

  public setDeleteCandidateIdx(idx: number): void {
    this._deleteCandidateIdx = idx;
  };

  public resetDeleteCandidateIdx(): void {
    setTimeout(() => this._deleteCandidateIdx = undefined);
  }

  public get deleteCandidateIdx(): number {
    return this._deleteCandidateIdx;
  }


  /* Focus */

  private setFocus(controlName: string, selectFirst = true, userClick = false): Observable<void> {
    const hasParent = (el: any, tag: string[]): boolean => {
      return !el ? false : (tag.includes(el.tagName) || hasParent(el.parentElement, tag));
    };

    return timer(0).pipe(map(() => {
      const selector = controlName ? `[name=${controlName}]` : '[name]';
      const nodes = Array.prototype.slice.call(this.elementRef.nativeElement.querySelectorAll(selector));
      const input = findFocusableElement(nodes[selectFirst ? 0 : nodes.length - 1]);
      if (!input) {
        return;
      }

      if (userClick && hasParent(input, ['NZ-SELECT', 'M-SELECT'])) {
        input.click();
      } else {
        input.focus();
      }
    }));
  }

  protected focusin(): void {
    if (document.activeElement !== this.table.nativeElement) {
      return;
    }

    if (!this._data.length) {
      this._initRow(true);
    } else if (this._item) {
      const firstEditableColumn = this.getEditableColumns(this._item.item)[0]?.mName;
      this.startRowEdit(this._item.uid, this._item.columnName(firstEditableColumn));
    } else {
      const firstEditableRowIdx = this.getNextEditableRowIndex(-1, 1);
      this.editRow(firstEditableRowIdx);
    }
  }

  protected focusinInput(rowIndex: number, colIndex: number): void {
    this.hotkeysManager.attach({component: this, rowIndex, colIndex});
  }

  protected focusinExpand(rowIndex: number): void {
    this.hotkeysManager.attach({component: this, rowIndex});
  }

  protected focusout(): void {
    if (isDefined(this._deleteCandidateIdx)) {
      this.resetDeleteCandidateIdx();
      return;
    }

    this.cancelRowEdit();
    findFocusableElement(this.table.nativeElement).focus();
  }


  /* Utils */

  protected isCellEditable(col: MuiEditableTableColumnComponent, item: T): boolean {
    return !!col.editTemplate && col.mCellEditable(item) && col.columnEditVisible;
  }

  private getEditableColumns(item: T): MuiEditableTableColumnComponent[] {
    return this._columns.filter(c => this.isCellEditable(c, item));
  }

  private getNextEditableRowIndex(currentIdx: number, direction: -1 | 1): number {
    const items = this._data.items.map(i => i.item);
    const length = items.length;

    const startFrom = direction > 0 ? currentIdx + 1 : currentIdx - 1;
    for (
      let i = startFrom;
      direction > 0 ? i < length : i >= 0;
      direction > 0 ? i++ : i--
    ) {
      if (this.mRowEditAllowed(items[i])) {
        return i;
      }
    }
  }

  protected get hasAnyExpandTemplate(): boolean {
    return !!this.expandEditTemplate || !!this.expandViewTemplate;
  }
}


class TableData<T> {
  public raw: T[];
  public items: TableDataItem<T>[];
  private readonly _items: {[uid: string]: TableDataItem<T>} = {};

  public constructor(data: T[]) {
    this.raw = data;
    this.items = data?.map(d => new TableDataItem(d));
    this._items = group(this.items, i => i.uid);
  }

  public sort(key: string, ascending: boolean): void {
    sort(this.items, 'item.' + key, ascending);
    this.items = [...this.items];
  }

  public get(uid: string): TableDataItem<T> {
    return this._items[uid];
  }

  public getByIndex(idx: number): TableDataItem<T> {
    return this.items[idx];
  }

  public add(item: T): TableDataItem<T> {
    const tdi = new TableDataItem(item);
    this.raw.push(item);
    this.items = [...this.items, tdi];
    this._items[tdi.uid] = tdi;
    return tdi;
  }

  public remove(item: TableDataItem<T>): void {
    remove(this.raw, item.item);
    delete this._items[item.uid];
    this.items = this.items.filter(i => i.uid !== item.uid);
  }

  public removeByUid(uid: string): TableDataItem<T> {
    const tdi = this.get(uid);
    this.remove(tdi);
    return tdi;
  }


  public get last(): TableDataItem<T> {
    return this.length > 0 ? this.items[this.length - 1] : null;
  }

  public get length(): number {
    return this.items.length;
  }
}

class TableDataItem<T> {
  public uid: string;
  public item: T;
  public valid: boolean = true;
  public pristine: boolean = false; // row is new and untouched
  public trigger: any = null;

  public constructor(item: T) {
    this.item = item;
    this.uid = uuid();
  }

  public redraw(): void {
    this.trigger = {};
  }

  public columnName(colName: string): string {
    return `${colName}-${this.uid}`;
  }
}
