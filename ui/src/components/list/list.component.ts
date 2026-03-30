import {AfterContentInit, Component, ContentChildren, DestroyRef, forwardRef, Input, OnChanges, QueryList} from '@angular/core';
import {BooleanInput, isDefined, toBoolean} from '@termx-health/core-util';
import {MuiListItemComponent} from './list-item.component';
import {MuiListService} from './list.service';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {delay} from 'rxjs';
import {NgChanges} from '../core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  standalone: false,
  selector: 'm-list',
  template: `
    <m-spinner [mLoading]="mLoading">
      <m-list-item *ngIf="isEmpty">
        <m-no-data></m-no-data>
      </m-list-item>
      <ng-container *ngIf="!isEmpty">
        <ng-content></ng-content>
      </ng-container>
    </m-spinner>
  `,
  host: {
    class: 'm-list',
    '[class.m-list--separated]': 'mSeparated',
    '[attr.tabindex]': `0`,

    '(keydown)': 'onKeydown($event)',
    '(focusout)': 'reset()',
    '(mouseleave)': 'reset()',
  },
  providers: [
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MuiListComponent), multi: true},
    MuiListService
  ]
})
export class MuiListComponent implements OnChanges, AfterContentInit, ControlValueAccessor {
  public static ngAcceptInputType_mLoading: boolean | string;
  public static ngAcceptInputType_mSelectable: boolean | string;
  public static ngAcceptInputType_mMultiple: boolean | string;
  public static ngAcceptInputType_mSeparated: boolean | string;
  public static ngAcceptInputType_mEmpty: boolean | string;
  public static ngAcceptInputType_mAllowClear: boolean | string;

  @Input() @BooleanInput() public mLoading: boolean;
  @Input() @BooleanInput() public mSelectable: boolean;
  @Input() @BooleanInput() public mMultiple: boolean;
  @Input() @BooleanInput() public mSeparated: boolean;
  @Input() @BooleanInput() public mEmpty: boolean;
  @Input() @BooleanInput() public mAllowClear: boolean = true;

  @ContentChildren(MuiListItemComponent) private items: QueryList<MuiListItemComponent>;


  private onChange: (x: MuiListItemComponent['mValue'] | MuiListItemComponent['mValue'][]) => void;
  // private onTouch: () => void;


  public constructor(
    private listService: MuiListService,
    private destroyRef: DestroyRef
  ) {}


  public ngOnChanges(changes: NgChanges<MuiListComponent>): void {
    if (changes['mMultiple']) {
      this.listService.setSelectMode(this.mMultiple ? 'multiple' : 'single');
    }
    if (changes['mSelectable']) {
      this.listService.setIsSelectable(this.mSelectable);
    }
    if (changes['mAllowClear']) {
      this.listService.setAllowedClear(this.mAllowClear);
    }
  }

  public ngAfterContentInit(): void {
    this.listService.init(this.items);
    this.listService.selectedItems$.pipe(takeUntilDestroyed(this.destroyRef), delay(0)).subscribe(items => {
      const values = items.map(i => i.mValue);
      this.onChange?.(this.mMultiple ? values : values[0]);
    });
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (!['m-list', 'm-list-item'].includes((event.target as Element).localName)) {
      return;
    }
    if (event.key === 'Enter') {
      if (this.items.length === 1 && this.items.get(0).isClickable) {
        this.items.get(0).emulateClick();
      } else {
        this.listService.activeItem?.emulateClick();
        this.reset();
      }
    } else {
      this.listService.onKeydown(event);
    }
  }

  protected reset(): void {
    this.listService.setActiveItem(null);
  }


  protected get isEmpty(): boolean {
    return isDefined(this.mEmpty) ? toBoolean(this.mEmpty) : !this.items.length;
  }


  /* CVA */

  public writeValue(vals: any | any[]): void {
    if (Array.isArray(vals)) {
      this.listService.setSelectedItems((this.mMultiple ? vals : [vals[0]]).filter(Boolean));
    } else {
      this.listService.setSelectedItems([vals].filter(Boolean));
    }
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(_fn: any): void {
    // this.onTouch = fn;
  }

  public setDisabledState(_isDisabled: boolean): void {
    // todo
  }
}
