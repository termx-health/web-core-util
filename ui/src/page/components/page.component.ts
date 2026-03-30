import {Component, Input, OnDestroy, OnInit, TemplateRef, ViewEncapsulation} from '@angular/core';
import {MuiPageLayoutComponent} from './page-layout.component';
import {BooleanInput} from '@termx-health/core-util';

@Component({
  standalone: false,
  selector: 'm-page',
  encapsulation: ViewEncapsulation.None,
  template: `
    <m-spinner [mLoading]="mLoading">
      <ng-content></ng-content>
    </m-spinner>
  `,
  host: {
    class: 'm-page'
  }
})
export class MuiPageComponent implements OnInit, OnDestroy {
  public static ngAcceptInputType_mFull: boolean | string;
  public static ngAcceptInputType_mLoading: boolean | string;

  @Input() public mTitle: string | TemplateRef<any>;
  @Input() @BooleanInput() public mFull: boolean;
  @Input() @BooleanInput() public mLoading: boolean;

  private ref: () => void;

  public constructor(
    private pageLayout: MuiPageLayoutComponent
  ) {}

  public ngOnInit(): void {
    this.ref = this.pageLayout.registerPage(this);
  }

  public ngOnDestroy(): void {
    this.ref?.();
  }
}
