import {Directive} from '@angular/core';

@Directive({
  standalone: false,selector: '[m-input], [mInput]'})
export class MuiInputDirective {
  // focus magic
}
