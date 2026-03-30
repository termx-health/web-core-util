import {Component, EventEmitter, Injectable, Input, Optional, Output, SkipSelf, TemplateRef, ViewEncapsulation} from '@angular/core';
import {BooleanInput} from '@termx-health/core-util';
import {MuiMenuComponent} from './menu.component';
import {MuiMenuItemBaseComponent} from './menu-item.base';
import {MuiMenuItemComponent} from './menu-item.component';

@Injectable()
export class SubmenuService {
  public level = 1;
  public offset = 1;

  public constructor(@SkipSelf() @Optional() public hostSubmenu: SubmenuService) {
    if (this.hostSubmenu) {
      this.level = this.hostSubmenu.level + 1;
    }
  }
}

@Component({
  standalone: false,
  selector: 'li[m-sub-menu]',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'm-menu__item m-menu__sub-menu',
    '[class.m-menu__sub-menu--section]': `mSection`,
    '[class.m-menu__sub-menu--open]': `isOpen`,
    '[class.m-menu__sub-menu--path-element]': `isInSelectedItemPath`,
  },
  template: `
    <ng-template #submenuChildren>
      <ng-content></ng-content>
    </ng-template>

    <ng-template #submenuChildrenOverlay>
      <div class="m-menu__group-label" *ngIf="mTitle && isMenuCollapsed">
        <ng-container *stringTemplateOutlet="mTitle">
          {{mTitle | toString | i18n}}
        </ng-container>
      </div>
      <div style="padding: .5rem">
        <ng-template [ngTemplateOutlet]="submenuChildren"></ng-template>
      </div>
    </ng-template>

    <a
        (click)="onSubmenuClick()"
        [mPopover]="isPopoverShown"
        [mTitle]="submenuChildrenOverlay"
        mPosition="right"
        mPopoverClass="m-menu__sub-menu__popover"
        mPlain
        tabindex="-1"
    >
      <div class="m-menu__item__inner" [style.padding-left]="offset - 1 + 'rem'">
        <!-- Icon -->
        <span class="m-menu__item__icon-container" *ngIf="mIcon || isMenuCollapsed"> 
          <m-icon class="m-menu__item__icon" [mCode]="mIcon || 'appstore'"></m-icon>
        </span>

        <!-- Label -->
        <span class="m-menu__item__label">
          <ng-container *stringTemplateOutlet="mTitle">
            {{mTitle | toString | i18n }}
          </ng-container>
        </span>

        <!-- Open toggle -->
        <ng-container *ngIf="isToggleButtonVisible">
          <a class="m-menu__item__icon-container m-menu__item__toggle" (click)="$event.stopPropagation(); toggleOpen()">
            <m-icon class="m-menu__item__icon" [mCode]="isOpen ? 'caret-up' : 'caret-down'"></m-icon>
          </a>
        </ng-container>
      </div>
    </a>

    <ng-container *ngIf="isOpen && !isPopoverShown">
      <ng-container *ngTemplateOutlet="submenuChildren"></ng-container>
    </ng-container>
  `,
  providers: [SubmenuService]
})
export class MuiSubMenuComponent extends MuiMenuItemBaseComponent {
  public static ngAcceptInputType_mOpen: boolean | string;
  public static ngAcceptInputType_mHideToggle: boolean | string;
  public static ngAcceptInputType_mSection: boolean | string;


  @Input() public mIcon: string;
  @Input() public mTitle: string | TemplateRef<any>;
  @Input() @BooleanInput() public mOpen: boolean;
  // hides items toggle/expand button
  @Input() @BooleanInput() public mHideToggle: boolean;
  // for visual structuring only, submenu title becomes "readonly", cannot click on tile, toggle expand button etc.
  @Input() @BooleanInput() public mSection: boolean;

  @Output() public mOpenChange = new EventEmitter<boolean>();
  @Output() public mClick = new EventEmitter<void>();

  // descendant items. pushed to array from MuiMenuItemComponent
  public _items: MuiMenuItemComponent[] = [];

  public constructor(
    private menu: MuiMenuComponent,
    @Optional() @SkipSelf() hostSubmenu: MuiSubMenuComponent
  ) {
    super(hostSubmenu);
  }


  /* External API */

  public open(): void {
    this.mOpen = true;
    this.subMenu?.open();
  }

  public close(): void {
    this.mOpen = false;
  }

  public selectItem(index: number): void {
    if (0 <= index && index < this._items.length) {
      this._items[index].selectItem();
    }
  }


  /* Internal API */

  protected onSubmenuClick(): void {
    if (this.mSection) {
      return;
    }
    if (this.menu.mExpandMode === 'click') {
      this.toggleOpen();
    }
    this.mClick.emit();
  }

  protected toggleOpen(): void {
    this.mOpen = !this.mOpen;
    this.mOpenChange.emit(this.mOpen);
  }


  /* Getters */

  protected get isOpen(): boolean {
    return !!this.mOpen || !!this.mSection;
  }

  protected get isPopoverShown(): boolean {
    return !this.isOpen || !!this.menu.mCollapsed;
  }

  protected get isInSelectedItemPath(): boolean {
    return this.menu.isSelectedPathElement(this);
  }

  protected get isToggleButtonVisible(): boolean {
    return this.menu.mExpandMode === 'toggle' &&
      !this.mHideToggle &&
      !this.isMenuCollapsed &&
      !this.mSection;
  }

  protected get isMenuCollapsed(): boolean {
    return !!this.menu.mCollapsed;
  }
}

