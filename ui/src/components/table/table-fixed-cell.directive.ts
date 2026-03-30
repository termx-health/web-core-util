import {Directive, ElementRef, Input, OnChanges, Renderer2} from '@angular/core';
import {NgChanges} from '../core';
import {BooleanInput} from '@termx-health/core-util';


@Directive({
  standalone: false,
  selector: 'td[mRight],th[mRight],td[mLeft],th[mLeft]',
  host: {
    '[class.m-table-cell-fix-left]': `isFixedLeft`,
    '[class.m-table-cell-fix-right]': `isFixedRight`,
    '[style.position]': `isFixed ? 'sticky' : null`
  }
})
export class MuiTableCellFixedDirective implements OnChanges {
  public static ngAcceptInputType_mLeft: boolean | string;
  public static ngAcceptInputType_mRight: boolean | string;

  @Input() @BooleanInput() public mLeft: boolean;
  @Input() @BooleanInput() public mRight: boolean;

  @Input() public colspan: number | string;
  @Input() public rowSpan: number | string;
  @Input() public colSpan: number | string;
  @Input() public rowspan: number | string;

  public isFixedRight = false;
  public isFixedLeft = false;
  public isFixed = false;

  public constructor(private renderer: Renderer2, public elementRef: ElementRef) {}

  public setAutoWidth(style: 'left' | 'right', autoRight: string | null): void {
    this.renderer.setStyle(this.elementRef.nativeElement, style, autoRight);
  }

  public setIsFirstRight(isFirstRight: boolean): void {
    this.setFixClass(isFirstRight, 'm-table-cell-fix-right-first');
  }

  public setIsLastLeft(isLastLeft: boolean): void {
    this.setFixClass(isLastLeft, 'm-table-cell-fix-left-last');
  }


  private setFixClass(flag: boolean, className: string): void {
    this.renderer.removeClass(this.elementRef.nativeElement, className);
    if (flag) {
      this.renderer.addClass(this.elementRef.nativeElement, className);
    }
  }

  private validatePx = (value: string | boolean): string => {
    if (typeof value === 'string' && value !== '') {
      return value;
    }
  };

  public ngOnChanges(changes: NgChanges<MuiTableCellFixedDirective>): void {
    const {mLeft, mRight} = changes;
    if (mLeft) {
      this.setIsLastLeft(false);
      this.isFixedLeft = this.mLeft !== false;
      this.setAutoWidth('left', this.validatePx(this.mLeft));
      this.isFixed = this.isFixedLeft || this.isFixedRight;
    }
    if (mRight) {
      this.setIsFirstRight(false);
      this.isFixedRight = this.mRight !== false;
      this.setAutoWidth('right', this.validatePx(this.mRight));
      this.isFixed = this.isFixedLeft || this.isFixedRight;
    }
  }
}
