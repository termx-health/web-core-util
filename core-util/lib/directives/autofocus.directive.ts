import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';
import {BooleanInput, findFocusableElement, toBoolean} from '../utils';

@Directive({selector: '[autofocus]'})
export class AutofocusDirective implements AfterViewInit {
  @Input() @BooleanInput() public autofocus: boolean | string = true;
  @Input() public focusTimeout = 100;

  public constructor(private el: ElementRef<HTMLInputElement>) {}

  public ngAfterViewInit(): void {
    setTimeout(() => {
      const fEl = findFocusableElement(this.el.nativeElement);
      // fixme: 'this.autofocus' is equal to ''! I have no idea why 'this.autofocus' is still not transformed to boolean.
      if (fEl && toBoolean(this.autofocus)) {
        fEl.focus();
      }
    }, this.focusTimeout);
  }
}
