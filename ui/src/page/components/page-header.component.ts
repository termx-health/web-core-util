import {Component, EventEmitter, Input, Output, TemplateRef, ViewEncapsulation} from '@angular/core';
import {BooleanInput, CoreI18nService} from '@termx-health/core-util';
import {DEFAULT_SYSTEM_LANGS, MuiConfigService, MuiSystemLangConfig} from '../../config';
import {startWith} from 'rxjs';

const fontMap: {[preset: string]: string} = {
  'normal': '14px',
  'large': '18px',
  'extraLarge': '26px'
};

@Component({
  standalone: false,
  selector: 'm-page-header-accessibility',
  template: `
    {{'marina.ui.page.accessibility.header' | i18n}}

    <m-modal [mVisible]="accessibility.modalVisible" (mClose)="accessibility.modalVisible = false">
      <div *m-modal-content>
        <m-form-item mLabel="marina.ui.page.accessibility.fontSize.header">
          <m-radio-group [(ngModel)]="accessibility.fontSize" mVertical>
            <label m-radio mValue="normal">{{'marina.ui.page.accessibility.fontSize.normal' | i18n}}</label>
            <label m-radio mValue="large">{{'marina.ui.page.accessibility.fontSize.large' | i18n}}</label>
            <label m-radio mValue="extraLarge">{{'marina.ui.page.accessibility.fontSize.extraLarge' | i18n}}</label>
          </m-radio-group>
        </m-form-item>
      </div>

      <div *m-modal-footer class="m-items-middle">
        <m-button style="width:100%" mDisplay="primary" (mClick)="applyA11ySettings()">{{'marina.ui.page.accessibility.apply' | i18n}}</m-button>
        <m-button style="width:100%" (mClick)="resetA11ySettings()">{{'marina.ui.page.accessibility.reset' | i18n}}</m-button>
      </div>
    </m-modal>
  `,
  host: {
    '(click)': `accessibility.modalVisible = true`
  }
})
export class MuiPageHeaderAccessibilityComponent {
  public accessibility = {
    modalVisible: false,
    fontSize: 'normal',
  };

  /* A11y */

  protected applyA11ySettings(): void {
    this.changeFontSize(this.accessibility.fontSize);
    this.accessibility.modalVisible = false;
  }

  protected resetA11ySettings(): void {
    this.accessibility = {
      modalVisible: false,
      fontSize: 'normal',
    };
    this.applyA11ySettings();
  }

  private changeFontSize(preset: string): void {
    document.documentElement.classList.remove('scaled');
    if (preset !== 'normal') {
      document.documentElement.classList.add('scaled');
    }
    document.documentElement.style.fontSize = fontMap[preset];
  }
}


export interface MuiPageUserInfo {
  initials: string,
  template?: TemplateRef<any>
}

@Component({
  standalone: false,
  selector: 'm-page-header',
  encapsulation: ViewEncapsulation.None,
  template: `
    <m-header [mTitle]="titleTpl" [mActions]="actionsTpl">
      <ng-template #titleTpl>
        <m-icon-button *ngIf="mMenuCollapsedChange.observed" [mIcon]="mMenuCollapsed ? 'appstore' : 'up'" (mClick)="toggleMenu()"/>

        <ng-container *stringTemplateOutlet="mTitle">
          {{mTitle | toString | i18n}}
        </ng-container>
      </ng-template>


      <ng-template #actionsTpl>
        <!--        <m-icon-button mIcon="bell"></m-icon-button>-->
        <!--        <m-divider mVertical></m-divider>-->

        <ng-container *ngIf="mUserInfo">
          <div class="m-page-header__userinfo" m-popover [mTitle]="mUserInfo.template" mPopoverClass="m-page-header__userinfo-overlay" mPlain mHideArrow>
            {{mUserInfo.initials}}
          </div>
          <m-divider mVertical/>
        </ng-container>


        <m-dropdown mOverlayClassName="m-page-header__dropdown {{mLogout.observed && mAuthenticated ? 'm-page-header__dropdown-with-logout': ''}}">
          <m-page-header-accessibility class="m-page-header__dropdown__border-bottom" *m-dropdown-item/>

          <ng-container *ngIf="mLangChange.observed">
            <ng-container *ngFor="let lang of systemLanguages | keys">
            <span
              *m-dropdown-item
              [class.m-page-header__dropdown--active]="i18nService.currentLang === lang"
              (click)="onLangSelect(lang)"
            >
              {{lang | apply: langName}}
            </span>
            </ng-container>
          </ng-container>

          <span class="m-page-header__dropdown__border-top" *mDropdownItemIf="mLogout.observed && mAuthenticated" (click)="onLogoutClick()">
            {{'marina.ui.page.logout' | i18n}}
          </span>
        </m-dropdown>

        <ng-container *ngIf="mLogin.observed && !mAuthenticated">
          <m-icon-button mIcon="login" (mClick)="onLoginClick()"/>
        </ng-container>
      </ng-template>
    </m-header>
  `,
  host: {
    class: 'm-page-header'
  }
})
export class MuiPageHeaderComponent {
  public static ngAcceptInputType_mMenuCollapsed: boolean | string;
  public static ngAcceptInputType_mAuthenticated: boolean | string;

  @Input() public mTitle?: string | TemplateRef<any>;
  @Input() @BooleanInput() public mAuthenticated: boolean;
  @Input() public mUserInfo: MuiPageUserInfo;
  @Input() @BooleanInput() public mMenuCollapsed: boolean = true;

  @Output() public mMenuCollapsedChange = new EventEmitter<boolean>();
  @Output() public mLangChange = new EventEmitter<string>();
  @Output() public mLogin = new EventEmitter<void>();
  @Output() public mLogout = new EventEmitter<void>();

  public systemLanguages: MuiSystemLangConfig;

  public constructor(
    public i18nService: CoreI18nService,
    configService: MuiConfigService
  ) {
    configService.getConfigChange('systemLanguages')
      .pipe(startWith(configService.getConfigFor('systemLanguages') ?? DEFAULT_SYSTEM_LANGS))
      .subscribe(resp => {
        this.systemLanguages = resp;
      });
  }


  /* Menu  */

  protected toggleMenu(): void {
    this.mMenuCollapsed = !this.mMenuCollapsed;
    this.mMenuCollapsedChange.emit(this.mMenuCollapsed);
  }


  /* Language change */

  protected langName = (lang: string): string => {
    return this.systemLanguages[lang]?.label || lang;
  };

  protected onLangSelect(lang: string): void {
    this.mLangChange.emit(lang);
  }


  /* Login*/

  protected onLoginClick(): void {
    this.mLogin.emit();
  }

  /* Logout */

  protected onLogoutClick(): void {
    this.mLogout.emit();
  }
}
