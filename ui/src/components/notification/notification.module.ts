import {NgModule} from '@angular/core';
import {CoreI18nModule, CoreUtilModule} from '@termx-health/core-util';
import {CommonModule} from '@angular/common';
import {OverlayModule} from '@angular/cdk/overlay';
import {MuiNotificationComponent} from './notification.component';
import {MuiNotificationContainerComponent} from './notification-container.component';
import {MuiNotificationService} from './notification.service';
import {MuiNotificationOverlayService} from './notification-overlay.service';
import {MuiAlertModule} from '../alert';


@NgModule({
  imports: [
    CommonModule,
    OverlayModule,

    CoreUtilModule,
    CoreI18nModule,

    MuiAlertModule
  ],
  declarations: [
    MuiNotificationComponent,
    MuiNotificationContainerComponent,
  ],
  exports: [
    MuiNotificationComponent,
    MuiNotificationContainerComponent,
  ],
  providers: [
    MuiNotificationService,
    MuiNotificationOverlayService,
  ]
})
export class MuiNotificationModule {
}
