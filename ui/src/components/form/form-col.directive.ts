import {Directive, Optional, TemplateRef} from '@angular/core';

@Directive({
  standalone: false,
  selector: '[m-form-col], [mFormCol]'
})
export class MuiFormColDirective {
  public constructor(@Optional() public template: TemplateRef<any>) {}
}
