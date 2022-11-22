import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {StringTemplateOutletDirective} from './string-template-outlet.directive';
import {AutofocusDirective} from './autofocus.directive';

const directives = [
  StringTemplateOutletDirective,
  AutofocusDirective
];

@NgModule({
  imports: [CommonModule],
  declarations: directives,
  exports: directives
})
export class CoreDirectivesModule {
}
