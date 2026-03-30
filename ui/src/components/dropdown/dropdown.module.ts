import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MuiDropdownComponent, MuiDropdownContainerDirective} from './dropdown.component';
import {MuiDropdownItemDirective} from './dropdown-item.directive';
import {CoreZorroModule} from '../../zorro';
import {MuiIconButtonModule} from '../inputs/button-icon/icon-button.module';


@NgModule({
  imports: [
    CommonModule,
    CoreZorroModule,
    MuiIconButtonModule
  ],
  declarations: [
    MuiDropdownComponent,
    MuiDropdownContainerDirective,
    MuiDropdownItemDirective
  ],
  exports: [
    MuiDropdownComponent,
    MuiDropdownContainerDirective,
    MuiDropdownItemDirective
  ]
})
export class MuiDropdownModule {
}
