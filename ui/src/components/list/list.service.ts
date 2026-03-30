import {Injectable, QueryList} from '@angular/core';
import {ActiveDescendantKeyManager} from '@angular/cdk/a11y';
import {MuiListItemComponent} from './list-item.component';
import {BehaviorSubject, Observable} from 'rxjs';
import {remove} from '@termx-health/core-util';


@Injectable()
export class MuiListService {
  private _keyManager: ActiveDescendantKeyManager<MuiListItemComponent>;
  private _items: QueryList<MuiListItemComponent>;


  private _selectedItems$ = new BehaviorSubject([]);
  private _selectMode: 'multiple' | 'single' = 'single';
  private _isSelectable = false;
  private _isAllowedClear = true;

  public init(items: QueryList<MuiListItemComponent>): void {
    this._items = items;
    this._keyManager = new ActiveDescendantKeyManager<MuiListItemComponent>(items).withWrap();
  }


  public onKeydown(event: KeyboardEvent): void {
    this._keyManager.onKeydown(event);
  }

  public setActiveItem(item: MuiListItemComponent): void {
    const idx = this._items.toArray().findIndex(i => i === item);
    this._keyManager.setActiveItem(idx);
  }

  public get activeItem(): MuiListItemComponent {
    return this._keyManager.activeItem;
  }


  public onItemClick(item: MuiListItemComponent): void {
    this.setActiveItem(item);

    if (this._isSelectable) {
      let selectedItems = this._selectedItems$.value;
      const containsItem = selectedItems.includes(item);
      if (this._selectMode === 'single') {
        selectedItems = containsItem ? [] : [item];
      } else {
        selectedItems = containsItem ? remove(selectedItems, item) : [...selectedItems, item];
      }
      if (!this._isAllowedClear && !selectedItems.length) {
        return
      }
      this._selectedItems$.next(selectedItems);
    }
  }

  public setAllowedClear(allowedClear: boolean): void {
    this._isAllowedClear = allowedClear;
  }

  public setIsSelectable(selectable: boolean): void {
    this._isSelectable = selectable;
    if (!selectable) {
      this._selectedItems$.next([]);
    }
  }

  public setSelectMode(mode: 'multiple' | 'single'): void {
    this._selectMode = mode;
    if (this._selectMode === 'single') {
      this._selectedItems$.next([this._selectedItems$.value[0]].filter(Boolean))
    } else {
      this._selectedItems$.next([...this._selectedItems$.value]);
    }
  }

  public setSelectedItems(vals: MuiListItemComponent['mValue'][]): void {
    if (this._isSelectable) {
      const items = this._items?.toArray().filter(i => vals.includes(i.mValue) && i.isClickable) ?? [];
      this._selectedItems$.next(items);
    }
  }

  public get selectedItems$(): Observable<MuiListItemComponent[]> {
    return this._selectedItems$.asObservable();
  }
}
