import {Component, DestroyRef, EventEmitter, Input, Output, QueryList, ViewChildren} from '@angular/core';
import {Params} from '@angular/router';
import {MuiSubMenuComponent} from '../../components';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';


export class MuiPageMenuItemSingle {
  public icon?: string;
  public label?: string;
  public items?: MuiPageMenuItem[];
  public route?: any[] | string;
  public disabled?: boolean;
  public queryParams?: Params;
  public command?: () => void;
}

export type MuiPageMenuItem = MuiPageMenuItemSingle | MuiPageMenuItemSingle[];


// Individual item

@Component({
  standalone: false,
  selector: 'm-page-menu-block-item',
  template: `
    <li m-menu-item
      *ngIf="!item.items?.length"
      [mIcon]="item.icon"
      [mMatchRouter]="!!item.route"
      [mDisabled]="item.disabled"
      (mSelect)="item.command?.()"
      [routerLink]="item.route  && !item.disabled ? item.route : undefined"
      [queryParams]="item.route  && !item.disabled ? item.queryParams : undefined"
    >
        {{item.label | i18n}}
    </li>
  `,
})
export class MuiPageMenuBlockItemComponent {
  @Input() public item: MuiPageMenuItemSingle;
}


// Vertical menu

@Component({
  standalone: false,
  selector: 'm-page-menu-vertical-block',
  template: `
    <ng-container *ngFor="let i of items">
      <ng-container *ngFor="let item of i | apply: normalize">
        <m-page-menu-block-item [item]="item"></m-page-menu-block-item>

        <ng-container *ngIf="item.items?.length">
          <li #sub m-sub-menu [mIcon]="item.icon" [mTitle]="item.label | i18n" (mClick)="sub.selectItem(0)">
            <ul>
              <m-page-menu-vertical-block [items]="item.items"></m-page-menu-vertical-block>
            </ul>
          </li>
        </ng-container>
      </ng-container>
    </ng-container>
  `
})
export class MuiPageMenuVerticalBlockComponent {
  @Input() public items: MuiPageMenuItem[] = [];
  @ViewChildren(MuiSubMenuComponent) private subMenus: QueryList<MuiSubMenuComponent>;

  public constructor(destroyRef: DestroyRef, pageMenu: MuiPageMenuComponent) {
    pageMenu.mItemSelect.pipe(takeUntilDestroyed(destroyRef)).subscribe(() => this.subMenus.forEach(s => s.close()));
  }

  protected normalize(i: MuiPageMenuItemSingle): MuiPageMenuItemSingle[] {
    return Array.isArray(i) ? i : [i];
  }
}


// Horizontal menu

@Component({
  standalone: false,
  selector: 'm-page-menu-horizontal-block',
  template: `
    <ng-container *ngIf="!item.items || !item.items.length">
      <m-page-menu-block-item [item]="item"></m-page-menu-block-item>
    </ng-container>

    <ng-container *ngIf="item.items?.length">
      <li #sub m-sub-menu [mIcon]="item.icon" [mTitle]="item.label | i18n" (mClick)="sub.selectItem(0)" mSection>
        <ul>
          <ng-container *ngFor="let i of item.items">
            <m-page-menu-horizontal-block [item]="$any(i)"></m-page-menu-horizontal-block>
          </ng-container>
        </ul>
      </li>
    </ng-container>
  `
})
export class MuiPageMenuHorizontalBlockComponent {
  @Input() public item: MuiPageMenuItemSingle;
  @ViewChildren(MuiSubMenuComponent) private subMenus: QueryList<MuiSubMenuComponent>;

  public constructor(destroyRef: DestroyRef, pageMenu: MuiPageMenuComponent) {
    pageMenu.mItemSelect.pipe(takeUntilDestroyed(destroyRef)).subscribe(() => this.subMenus.forEach(s => s.close()));
  }
}


// Menu

@Component({
  standalone: false,
  selector: 'm-page-menu',
  template: `
    <ul *ngIf="mMode === 'vertical'" m-menu mExpandMode="ignored" (mClick)="mItemSelect.next()">
      <m-page-menu-vertical-block [items]="mItems"></m-page-menu-vertical-block>
    </ul>

    <div *ngIf="mMode === 'horizontal'" class="m-page__menu_container" [style.--m-menu-col-count]="mItems.length">
      <ul *ngFor="let item of mItems" m-menu (mClick)="mItemSelect.next()">
        <m-page-menu-horizontal-block *ngFor="let i of item | apply: normalize" [item]="i"></m-page-menu-horizontal-block>
      </ul>
    </div>
  `
})
export class MuiPageMenuComponent {
  @Input() public mMode: 'vertical' | 'horizontal' = 'vertical';
  @Input() public mItems: MuiPageMenuItem[] = [];
  @Output() public mItemSelect = new EventEmitter<void>();

  protected normalize(i: MuiPageMenuItemSingle): MuiPageMenuItemSingle[] {
    return Array.isArray(i) ? i : [i];
  }
}
