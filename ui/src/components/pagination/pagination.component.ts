import {ChangeDetectionStrategy, Component, EventEmitter, Input, OnChanges, Output, TemplateRef} from '@angular/core';
import {NgChanges} from '../core';
import {BooleanInput} from '@termx-health/core-util';

@Component({
  standalone: false,
  selector: 'm-pagination',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-template #paginationButton let-icon="icon" let-disabled="disabled" let-page="page">
      <m-button mDisplay="text" mShape="circle" mSize="small" [disabled]="disabled" (mClick)="setPage(page)">
        <m-icon [mCode]="icon"></m-icon>
      </m-button>
    </ng-template>

    <span class="m-pagination__total-text" *ngIf="mShowTotal">
      <ng-template
        [ngTemplateOutlet]="mShowTotal"
        [ngTemplateOutletContext]="{ $implicit: mTotal, range: _ranges }"
      ></ng-template>
    </span>

    <!-- Left navigation -->
    <div class="m-pagination__pages-container">
      <ng-container *ngIf="_pages.length >= MAX_VIEW_PAGES">
        <ng-container
          [ngTemplateOutlet]="paginationButton"
          [ngTemplateOutletContext]="{icon: 'double-left', disabled: mPageIndex === 1, page: 1}"
        ></ng-container>
      </ng-container>

      <ng-container
        [ngTemplateOutlet]="paginationButton"
        [ngTemplateOutletContext]="{icon: 'left', disabled: mPageIndex === 1, page: mPageIndex - 1}"
      ></ng-container>

      <!-- Pages -->
      <span class="m-pagination__pages">
          <m-button
            *ngFor="let i of displayedSlice"
            [class.m-pagination-active-btn]="i === mPageIndex"
            [mDisplay]="i===mPageIndex ? 'link': 'text'"
            mShape="circle"
            (mClick)="onPageIndexChange(i)"
          >
            {{i}}
          </m-button>
        </span>

      <!-- Right navigation -->
      <ng-container
        [ngTemplateOutlet]="paginationButton"
        [ngTemplateOutletContext]="{icon: 'right', disabled: _pages.length === mPageIndex, page: mPageIndex + 1}"
      ></ng-container>

      <ng-container *ngIf="_pages.length >= MAX_VIEW_PAGES">
        <ng-container
          [ngTemplateOutlet]="paginationButton"
          [ngTemplateOutletContext]="{icon: 'double-right', disabled: _pages.length === mPageIndex, page: _pages.length}"
        ></ng-container>
      </ng-container>
    </div>


    <div *ngIf="mShowPageSizeChanger">
      <m-select small [ngModel]="mPageSize" (ngModelChange)="setPageSize($event)" [allowClear]="false">
        <m-option *ngFor="let opt of mPageSizeOptions" [mLabel]="opt | toString" [mValue]="opt"></m-option>
      </m-select>
    </div>
  `,
  host: {
    class: 'm-pagination'
  }
})
export class MuiPaginationComponent implements OnChanges {
  public readonly MAX_VIEW_PAGES = 5;
  public _pages: number[] = [];
  public _ranges: [number, number] = [0, 0];

  @Input() @BooleanInput() public mShowPageSizeChanger: boolean;
  @Input() public mPageSizeOptions: number[] = [10, 20, 50];
  @Input() public mShowTotal: TemplateRef<{$implicit: number; range: [number, number]}>;

  @Input() public mTotal = 10;
  @Input() public mPageSize = 10;
  @Input() public mPageIndex = 1;

  @Output() public readonly mPageSizeChange = new EventEmitter<number>();
  @Output() public readonly mPageIndexChange = new EventEmitter<number>();


  public ngOnChanges(changes: NgChanges<MuiPaginationComponent>): void {
    if (changes.mTotal) {
      this.onTotalChange(this.mTotal);
    }
    if (changes.mPageSize) {
      this.onPageSizeChange(this.mPageSize);
    }
    if (changes.mPageIndex) {
      this.onPageIndexChange(this.mPageIndex);
    }

    this._ranges = [(this.mPageIndex - 1) * this.mPageSize + 1, Math.min(this.mPageIndex * this.mPageSize, this.mTotal)];
  }


  protected get displayedSlice(): number[] {
    const elIndex = this.mPageIndex;
    const elementsOnSide = Math.floor(this.MAX_VIEW_PAGES / 2);

    const missingFromRight = Math.max(0, elIndex + elementsOnSide - this._pages.length);
    const missingFromLeft = Math.min(elIndex - elementsOnSide - 1, 0);
    const min = elIndex - elementsOnSide - missingFromLeft - missingFromRight;
    const max = elIndex + elementsOnSide - missingFromRight - missingFromLeft;

    if (this._pages.length < this.MAX_VIEW_PAGES) {
      return this._pages;
    }
    return [...Array(max + 1).keys()].slice(min, max + 1);
  }

  protected setPage(idx: number): void {
    this.onPageIndexChange(idx);
  }

  protected onPageIndexChange(index: number): void {
    const totalPages = MuiPaginationComponent.getPageCount(this.mTotal, this.mPageSize);
    const validIndex = MuiPaginationComponent.validatePageIndex(index, totalPages);
    if (validIndex !== this.mPageIndex) {
      Promise.resolve().then(() => {
        this.mPageIndex = validIndex;
        this.mPageIndexChange.emit(validIndex);
      });
    }
    this.composePages(totalPages);
  }

  protected setPageSize(newSize: number): void {
    if (newSize != this.mPageSize) {
      this.mPageSize = newSize;
      this.mPageSizeChange.emit(newSize);

      const totalPages = MuiPaginationComponent.getPageCount(this.mTotal, newSize);
      if (totalPages < this.mPageIndex){
        this.onPageIndexChange(totalPages);
      }
    }
  }

  protected onPageSizeChange(size: number): void {
    const totalPages = MuiPaginationComponent.getPageCount(this.mTotal, size);
    if (totalPages < this.mPageIndex) {
      this.mPageSize = size;
      this.mPageSizeChange.emit(size);
      this.onPageIndexChange(totalPages);
    } else {
      this.composePages(totalPages);
    }
  }

  protected onTotalChange(total: number): void {
    const totalPages = MuiPaginationComponent.getPageCount(total, this.mPageSize);
    if (this.mPageIndex > totalPages) {
      this.onPageIndexChange(totalPages);
    } else {
      this.composePages(totalPages);
    }
  }

  private composePages(totalPages: number): void {
    if (totalPages <= 0) {
      this._pages = [];
    }
    this._pages = [...Array(totalPages).keys()].map(i => i + 1);
  }

  private static validatePageIndex(value: number, lastIndex: number): number {
    if (value > lastIndex) {
      return lastIndex;
    } else if (value < 1) {
      return 1;
    } else {
      return value;
    }
  }

  private static getPageCount(total: number, pageSize: number): number {
    return pageSize > 0 && total > 0 ? Math.ceil(total / pageSize) : 1;
  }
}
