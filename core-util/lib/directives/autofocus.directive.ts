import {AfterViewInit, Directive, ElementRef, Input} from '@angular/core';
import {findFocusableElement} from '../utils';

@Directive({
  selector: '[autofocus], [autofocus]'
})
export class AutofocusDirective implements AfterViewInit {
  @Input() public focusTimeout: number = 100;

  public constructor(private el: ElementRef<HTMLInputElement>) {}

  public ngAfterViewInit(): void {
    setTimeout(() => {
      const fel = findFocusableElement(this.el.nativeElement);
      if (fel) {
        fel.focus();
      }
    }, this.focusTimeout);
  }
}
