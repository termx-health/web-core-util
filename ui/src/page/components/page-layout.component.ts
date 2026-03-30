import {Component, EventEmitter, Input, Output, TemplateRef, ViewEncapsulation} from '@angular/core';
import {BooleanInput, remove, toBoolean} from '@termx-health/core-util';
import {MuiPageComponent} from './page.component';
import {MuiPageBarComponent} from './page-bar.component';
import {MuiPageUserInfo} from './page-header.component';
import {MuiPageMenuItem} from './page-menu.component';

@Component({
  standalone: false,
  selector: 'm-page-layout',
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-template
      cdkConnectedOverlay
      [cdkConnectedOverlayOrigin]="origin"
      [cdkConnectedOverlayOpen]="isMenuVisible"
      (overlayOutsideClick)="closeMenu()"
    >
      <m-page-menu class="m-page__menu" [mItems]="mMenu" [mMode]="mMenuMode" (mItemSelect)="closeMenu()"></m-page-menu>
    </ng-template>

    <div class="m-page__layout">
      <div class="m-page__header-wrapper" #origin="cdkOverlayOrigin" cdkOverlayOrigin>
        <m-page-header
          [mTitle]="title"
          [mAuthenticated]="mAuthenticated"
          [mUserInfo]="mUserInfo"
          [(mMenuCollapsed)]="isMenuCollapsed"
          (mMenuCollapsedChange)="isMenuVisible = !$event"
          (mLangChange)="onLangSelect($event)"
          (mLogin)="onLogin()"
          (mLogout)="onLogout()"
        ></m-page-header>
      </div>

      <div class="m-page__content-wrapper">
        <!-- Top page bars -->
        <div class="m-page__bar m-page__bar__top" *ngIf="topPageBars.length">
          <ng-container *ngFor="let bar of topPageBars">
            <ng-template [ngTemplateOutlet]="bar.ngContent"></ng-template>
          </ng-container>
        </div>

        <div class="m-page__content" [class.m-page__content--full]="fullPage">
          <!-- m-page component may (not) present in the ng-content -->
          <ng-content></ng-content>
        </div>

        <!-- Bottom page bars -->
        <div class="m-page__bar m-page__bar__bottom" *ngIf="bottomPageBars.length">
          <ng-container *ngFor="let bar of bottomPageBars">
            <ng-template [ngTemplateOutlet]="bar.ngContent"></ng-template>
          </ng-container>
        </div>
      </div>
    </div>
  `,
  host: {
    class: 'm-page-layout'
  }
})
export class MuiPageLayoutComponent {
  public static ngAcceptInputType_mAuthenticated: boolean | string;

  @Input() public mTitle: string | TemplateRef<any>;
  @Input() @BooleanInput() public mAuthenticated: boolean;
  @Input() public mUserInfo: MuiPageUserInfo;

  @Input() public mMenu: MuiPageMenuItem[] = [];
  @Input() public mMenuMode: 'vertical' | 'horizontal' = 'vertical';

  @Output() public mLangChange = new EventEmitter<string>();
  @Output() public mLogin = new EventEmitter<void>();
  @Output() public mLogout = new EventEmitter<void>();

  protected isMenuCollapsed: boolean = true;
  protected isMenuVisible: boolean;

  private mPage: MuiPageComponent;
  private mPageBars: MuiPageBarComponent[] = [];


  /* External API */

  public registerPage(page: MuiPageComponent): () => void {
    this.mPage = page;
    return () => this.mPage = undefined;
  }

  public registerBar(bar: MuiPageBarComponent): () => void {
    this.mPageBars = [...this.mPageBars, bar];
    return () => this.mPageBars = remove(this.mPageBars, bar);
  }


  /* Internal API */

  protected onLangSelect(lang: string): void {
    if (!this.mLangChange.observed) {
      console.info("mLangChange isn't observed");
    }
    this.mLangChange.emit(lang);
  }

  public onLogin(): void {
    if (!this.mLogin.observed) {
      console.info("mLogin isn't observed");
    }
    this.mLogin.emit();
  }

  public onLogout(): void {
    if (!this.mLogout.observed) {
      console.info("mLogout isn't observed");
    }
    this.mLogout.emit();
  }

  protected closeMenu(): void {
    this.isMenuVisible = false;
    window.setTimeout(() => this.isMenuCollapsed = true);
  }


  /* Getters */

  protected get title(): string | TemplateRef<any> {
    return this.mPage?.mTitle || this.mTitle;
  }

  protected get fullPage(): boolean {
    return toBoolean(this.mPage?.mFull);
  }

  protected get topPageBars(): MuiPageBarComponent[] {
    return this.mPageBars.filter(b => b.mPosition === 'top');
  }

  protected get bottomPageBars(): MuiPageBarComponent[] {
    return this.mPageBars.filter(b => b.mPosition === 'bottom');
  }
}
