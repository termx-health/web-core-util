import {Directive, ElementRef, EventEmitter, Input, Output} from '@angular/core';


@Directive({
  standalone: false,
  selector: 'a',
  host: {
    '[attr.tabindex]': 'tabindex ?? 0',
    '[attr.role]': 'mClick.observed ? "button" : "link"',
    '(click)': 'mClick.emit($event)',
    '(keyup.enter)': 'simulateClick()'
  }
})
export class MuiLinkDirective {
  @Input() public tabindex;
  @Output() public mClick = new EventEmitter<MouseEvent>();

  public constructor(
    private host: ElementRef,
  ) { }

  protected simulateClick(): void {
    this.host.nativeElement.click();
  }
}

