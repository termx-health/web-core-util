import {
  AfterContentInit,
  Component,
  ContentChildren,
  DestroyRef,
  EventEmitter,
  Input,
  OnChanges,
  Optional,
  Output,
  QueryList,
  ViewEncapsulation
} from '@angular/core';
import {MuiSubMenuComponent} from './submenu.component';
import {MuiMenuComponent} from './menu.component';
import {BooleanInput} from '@termx-health/core-util';
import {NgChanges} from '../core';
import {MuiMenuItemBaseComponent} from './menu-item.base';
import {NavigationEnd, Router, RouterLink} from '@angular/router';
import {filter, startWith} from 'rxjs';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';


@Component({
  standalone: false,
  selector: 'li[m-menu-item]',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'm-menu__item',
    '[class.m-menu__item--selected]': `isSelected`,
    '[class.m-menu__item--disabled]': `mDisabled`,
    '[attr.tabindex]': 'hasLink ? -1 : undefined'
  },
  template: `
      <ng-template #itemLabel>
          <ng-content></ng-content>
      </ng-template>

      <a
              (click)="selectItem()"
              [mTooltip]="isTooltipShown"
              [mTitle]="itemLabel"
              mTooltipClass="m-menu__item__tooltip"
              mPosition="right"
      >
          <div class="m-menu__item__inner" [style.padding-left]="offset - 1 + 'rem'">
              <!-- Icon -->
              <span class="m-menu__item__icon-container" *ngIf="mIcon">
          <m-icon class="m-menu__item__icon" [mCode]="mIcon"></m-icon>
        </span>

              <!-- Label -->
              <!-- Only ONE template outlet for ng-content should be displayed -->
              <span class="m-menu__item__label" *ngIf="!isTooltipShown">
          <ng-container *ngTemplateOutlet="itemLabel"></ng-container>
        </span>
          </div>
      </a>
  `
})
export class MuiMenuItemComponent extends MuiMenuItemBaseComponent implements OnChanges, AfterContentInit {
  public static ngAcceptInputType_mMatchRouter: boolean | string;
  public static ngAcceptInputType_mExactRoute: boolean | string;
  public static ngAcceptInputType_mSelected: boolean | string;
  public static ngAcceptInputType_mDisabled: boolean | string;


  @Input() public mIcon: string;
  @Input() @BooleanInput() public mMatchRouter: boolean;
  @Input() @BooleanInput() public mExactRoute: boolean;
  // automatically selects menu-item.
  // when multiple items are selected, then submenu for every selected item is opened, but only the latest selected item is selected by menu
  @Input() @BooleanInput() public readonly mSelected: boolean;
  @Input() @BooleanInput() public mDisabled: boolean;
  @Output() public mSelect = new EventEmitter<void>();

  @ContentChildren(RouterLink, {descendants: true}) private routerLinks!: QueryList<RouterLink>;

  public constructor(
    private router: Router,
    private menu: MuiMenuComponent,
    private destroyRef: DestroyRef,
    @Optional() hostSubmenu: MuiSubMenuComponent,
    @Optional() private routerLink?: RouterLink
  ) {
    super(hostSubmenu);
    if (hostSubmenu) {
      hostSubmenu._items.push(this);
    }
  }

  public ngOnChanges(changes: NgChanges<MuiMenuItemComponent>): void {
    const {mSelected} = changes;
    if (mSelected) {
      if (this.mSelected) {
        this.selectItem();
      } else {
        this.unselectItem();
      }
    }
  }

  public ngAfterContentInit(): void {
    this.router?.events.pipe(
      takeUntilDestroyed(this.destroyRef),
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => this.updateRouterActive());

    this.routerLinks.changes.pipe(
      takeUntilDestroyed(this.destroyRef),
      startWith(true)
    ).subscribe(() => this.updateRouterActive());
  }


  private _selectItem(): void {
    if (this.isSelected) {
      return;
    }
    this.menu.onDescendantMenuItemSelect(this);
    this.subMenu?.open();
    this.mSelect.emit();
  }


  /* External API */

  public selectItem(): void {
    if (this.mDisabled) {
      return;
    }

    this.menu.onDescendantMenuItemClick(this);
    const routerLink = this.routerLink ?? this.routerLinks.first;
    if (routerLink?.urlTree) {
      this._selectItem();
      this.router.navigateByUrl(routerLink.urlTree.toString());
    } else {
      this._selectItem();
    }
  }

  public unselectItem(): void {
    this.menu.onDescendantMenuItemSelect(undefined);
  }


  /* Router */

  private updateRouterActive(): void {
    if (
      !this.routerLinks ||
      !this.router ||
      !this.router.navigated ||
      !this.mMatchRouter ||
      this.mDisabled
    ) {
      return;
    }
    Promise.resolve().then(() => {
      const hasActiveLinks = this.hasActiveLinks();
      if (hasActiveLinks !== this.isSelected) {
        if (hasActiveLinks) {
          this._selectItem();
        } else {
          this.unselectItem();
        }
      }
    });
  }

  private hasActiveLinks(): boolean {
    const isActiveCheckFn = this.isLinkActive(this.router);
    return (this.routerLink && isActiveCheckFn(this.routerLink)) || this.routerLinks?.some(isActiveCheckFn);
  }

  private isLinkActive(router: Router): (link: (RouterLink)) => boolean {
    return (link: RouterLink) => link.urlTree ? router.isActive(link.urlTree, {
      paths: this.mExactRoute ? 'exact' : 'subset',
      queryParams: this.mExactRoute ? 'exact' : 'subset',
      fragment: 'ignored',
      matrixParams: 'ignored'
    }) : false;
  }

  protected get hasLink(): boolean {
    return !!this.routerLink || this.routerLinks?.length > 0;
  }

  /* Getters */

  protected get isSelected(): boolean {
    return this.menu.isSelected(this);
  }

  protected get isTooltipShown(): boolean {
    return this.menu.mCollapsed && this.mLevel === 1;
  }

  public override get offset(): number {
    return super.offset + (this.subMenu?.mSection ? -1 : 0);
  }
}

