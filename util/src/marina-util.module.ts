import {NgModule} from '@angular/core';
import {CoreUtilModule} from '@termx-health/core-util';
import {CommonModule} from '@angular/common';
import {LocalNamePipe} from './pipe';


const components = [
  LocalNamePipe
];

@NgModule({
  imports: [
    CommonModule,
    CoreUtilModule,
  ],
  declarations: [...components],
  exports: [...components]
})
export class MarinaUtilModule {
}
