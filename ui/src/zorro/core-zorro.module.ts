import {NgModule} from '@angular/core';
import {NzButtonModule} from 'ng-zorro-antd/button';
import {NzBreadCrumbModule} from 'ng-zorro-antd/breadcrumb';
import {NzCascaderModule} from 'ng-zorro-antd/cascader';
import {NzCheckboxModule} from 'ng-zorro-antd/checkbox';
import {NzCollapseModule} from 'ng-zorro-antd/collapse';
import {NzDatePickerModule} from 'ng-zorro-antd/date-picker';
import {NzDropDownModule} from 'ng-zorro-antd/dropdown';
import {NzFormModule} from 'ng-zorro-antd/form';
import {NzGridModule} from 'ng-zorro-antd/grid';
import {NzIconModule} from 'ng-zorro-antd/icon';
import {NzInputModule} from 'ng-zorro-antd/input';
import {NzInputNumberModule} from 'ng-zorro-antd/input-number';
import {NzLayoutModule} from 'ng-zorro-antd/layout';
import {NzRadioModule} from 'ng-zorro-antd/radio';
import {NzSelectModule} from 'ng-zorro-antd/select';
import {NzSliderModule} from 'ng-zorro-antd/slider';
import {NzSwitchModule} from 'ng-zorro-antd/switch';
import {NzTabsModule} from 'ng-zorro-antd/tabs';
import {NzTimePickerModule} from 'ng-zorro-antd/time-picker';
import {NzTreeModule} from 'ng-zorro-antd/tree';
import {NzTreeSelectModule} from 'ng-zorro-antd/tree-select';
import {NzSkeletonModule} from 'ng-zorro-antd/skeleton';
import {en_US, et_EE, NZ_DATE_CONFIG, NzI18nService, ru_RU} from 'ng-zorro-antd/i18n';
import {NzIconService} from 'ng-zorro-antd/icon';
import {CoreI18nService} from '@termx-health/core-util';
import {NzTimelineModule} from 'ng-zorro-antd/timeline';
import {NzListModule} from 'ng-zorro-antd/list';
import {NzTreeViewModule} from 'ng-zorro-antd/tree-view';
import {startWith} from 'rxjs';
import {NzDrawerModule} from 'ng-zorro-antd/drawer';

// todo: get rid of zorro in the nearest future

export const zorroModules = [
  // NzAlertModule,
  // NzAnchorModule,
  // NzAutocompleteModule,
  // NzAvatarModule,
  // NzBackTopModule,
  // NzBadgeModule,
  // NzCalendarModule,
  // NzCardModule,
  // NzCarouselModule,
  // NzCommentModule,
  // NzDescriptionsModule,
  // NzDividerModule,
  // NzEmptyModule,
  // NzI18nModule,
  // NzMentionModule,
  // NzMenuModule,
  // NzMessageModule,
  // NzModalModule,
  // NzNoAnimationModule,
  // NzNotificationModule,
  // NzPageHeaderModule,
  // NzPaginationModule,
  // NzPopconfirmModule,
  // NzPopoverModule,
  // NzProgressModule,
  // NzRateModule,
  // NzResultModule,
  // NzSpinModule,
  // NzStatisticModule,
  // NzStepsModule,
  // NzTableModule,
  // NzTagModule,
  // NzToolTipModule,
  // NzTransButtonModule,
  // NzTransferModule,
  // NzTypographyModule,
  // NzUploadModule,
  // NzWaveModule,
  NzBreadCrumbModule,
  NzButtonModule,
  NzCascaderModule,
  NzCheckboxModule,
  NzCollapseModule,
  NzDatePickerModule,
  NzDrawerModule,
  NzDropDownModule,
  NzFormModule,
  NzGridModule,
  NzIconModule,
  NzInputModule,
  NzInputNumberModule,
  NzLayoutModule,
  NzListModule,
  NzRadioModule,
  NzSelectModule,
  NzSkeletonModule,
  NzSliderModule,
  NzSwitchModule,
  NzTabsModule,
  NzTimePickerModule,
  NzTimelineModule,
  NzTreeModule,
  NzTreeViewModule,
  NzTreeSelectModule
];

@NgModule({
  imports: zorroModules,
  exports: zorroModules,
  providers: [
    {provide: NZ_DATE_CONFIG, useValue: {firstDayOfWeek: 1}} // fixme: configurable
  ]
})
export class CoreZorroModule {
  public constructor(coreI18nService: CoreI18nService, nzI18nService: NzI18nService, nzIconService: NzIconService) {
    nzIconService.changeAssetsSource('/');
    coreI18nService.localeChange.pipe(startWith(coreI18nService.currentLang)).subscribe(localId => {
      nzI18nService.setLocale(this.getLocale(localId));
    });
  }

  public getLocale(localId: string): any {
    switch (localId) {
      case 'en':
        return en_US;
      case 'et':
        return et_EE;
      case 'ru':
        return ru_RU;
      default:
        return en_US;
    }
  }
}
