import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MuiButtonModule} from '../inputs';
import {MuiModalComponent, MuiModalContentDirective, MuiModalFooterDirective, MuiModalHeaderDirective} from './modal.component';
import {MuiModalContainerComponent} from './modal-container.component';
import {MuiCardModule} from '../card';
import {MuiIconModule} from '../icon';
import {MuiModalOverlayService} from './modal-overlay.service';
import {A11yModule} from '@angular/cdk/a11y';
import {MuiCoreModule} from '../core';


@NgModule({
  imports: [
    CommonModule,
    A11yModule,

    MuiCoreModule,
    MuiCardModule,
    MuiButtonModule,
    MuiIconModule,
  ],
  declarations: [
    MuiModalComponent,
    MuiModalContainerComponent,
    MuiModalContentDirective,
    MuiModalFooterDirective,
    MuiModalHeaderDirective,
  ],
  exports: [
    MuiModalComponent,
    MuiModalContainerComponent,
    MuiModalContentDirective,
    MuiModalFooterDirective,
    MuiModalHeaderDirective,
  ],
  providers: [
    MuiModalOverlayService,
  ]
})
export class MuiModalModule {
}
