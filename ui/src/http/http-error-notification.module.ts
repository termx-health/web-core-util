import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MuiHttpErrorNotificationComponent} from './http-error-notification.component';
import {MuiIconModule} from '../components';
import {CoreI18nModule} from '@termx-health/core-util';
import {ClipboardModule} from '@angular/cdk/clipboard';


@NgModule({
  imports: [
    CommonModule,
    ClipboardModule,

    CoreI18nModule,
    MuiIconModule,
  ],
  declarations: [
    MuiHttpErrorNotificationComponent
  ],
  exports: [
    MuiHttpErrorNotificationComponent
  ]
})
export class MuiHttpErrorNotificationModule {
}
