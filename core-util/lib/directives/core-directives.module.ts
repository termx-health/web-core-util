import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StringTemplateOutletDirective} from './string-template-outlet.directive';

const directives = [
  StringTemplateOutletDirective
];

@NgModule({
  imports: [CommonModule,],
  declarations: directives,
  exports: directives
})
export class CoreDirectivesModule {
}
