import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';
import {BooleanInput, findFocusableElement} from '../utils';

@Directive({selector: '[autofocus]'})
export class AutofocusDirective implements AfterViewInit {
  @Input() @BooleanInput() public autofocus: boolean | string = true;
  @Input() public focusTimeout: number = 100;

  public constructor(private el: ElementRef<HTMLInputElement>) {}

  public ngAfterViewInit(): void {
    setTimeout(() => {
      const fel = findFocusableElement(this.el.nativeElement);
      if (fel && this.autofocus) {
        fel.focus();
      }
    }, this.focusTimeout);
  }
}
