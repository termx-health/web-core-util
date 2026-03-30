import {Component, EventEmitter, Input, Output, TemplateRef, ViewEncapsulation} from '@angular/core';
import {BooleanInput} from '@termx-health/core-util';
import {MuiMenuItemBaseComponent} from './menu-item.base';
import {MuiMenuItemComponent} from './menu-item.component';


@Component({
  standalone: false,
  selector: 'ul[m-menu]',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'm-menu',
    '[class.m-menu--collapsed]': 'mCollapsed'
  },
  template: `
    <ng-container *ngIf="mStart">
      <ng-template [ngTemplateOutlet]="mStart"></ng-template>
    </ng-container>

    <div class="m-menu__inner" mScrollable>
      <ng-content></ng-content>
    </div>

    <ng-container *ngIf="mEnd">
      <ng-template [ngTemplateOutlet]="mEnd"></ng-template>
    </ng-container>
  `
})
export class MuiMenuComponent {
  public static ngAcceptInputType_mCollapsed: boolean | string;
  public static ngAcceptInputType_mSelectable: boolean | string;

  @Input() @BooleanInput() public mCollapsed: boolean;
  // whether menu items could be set as "selected", if false only mSelect events are emitted
  @Input() @BooleanInput() public mSelectable: boolean = true;
  // how sub-menus are expanded, by click on title or dedicated toggle button
  @Input() public mExpandMode: 'click' | 'toggle' | string = 'toggle';
  // emits when any menu item was selected
  @Output() public mSelect = new EventEmitter<MuiMenuItemComponent>();
  // emits if user and only user clicked on menu item (mSelect fires too)
  @Output() public mClick = new EventEmitter<MuiMenuItemComponent>();

  @Input() public mStart: TemplateRef<any>;
  @Input() public mEnd: TemplateRef<any>;

  private selectedItem: MuiMenuItemComponent;
  private selectedItemPath: MuiMenuItemBaseComponent[] = [];


  /* External API */

  public onDescendantMenuItemSelect(item: MuiMenuItemComponent): void {
    if (this.mSelectable) {
      this.selectedItem = item;
      this.selectedItemPath = item ? this.getSelectedItemPath(item) : [];
      this.mSelect.emit(this.selectedItem);
    }
  }

  public onDescendantMenuItemClick(item: MuiMenuItemComponent): void {
    this.mClick.emit(item);
  }

  public isSelected(item: MuiMenuItemComponent): boolean {
    return this.selectedItem === item;
  }

  public isSelectedPathElement(item: MuiMenuItemBaseComponent): boolean {
    return this.selectedItemPath.includes(item);
  }


  /* Utils */

  private getSelectedItemPath = (item: MuiMenuItemBaseComponent): MuiMenuItemBaseComponent[] => {
    if (item.subMenu) {
      return [item.subMenu, ...this.getSelectedItemPath(item.subMenu)];
    }
    return [];
  };
}

