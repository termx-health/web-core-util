import {Directive, OnDestroy, OnInit} from '@angular/core';
import {CdkScrollable} from '@angular/cdk/overlay';

@Directive({
  standalone: false,
  selector: '[m-scrollable], [mScrollable]',
  providers: [CdkScrollable]
})
export class MuiScrollableDirective implements OnInit, OnDestroy {
  public constructor(
    private cdkScrollable: CdkScrollable,
  ) { }

  public ngOnInit(): void {
    this.cdkScrollable.ngOnInit();
  }

  public ngOnDestroy(): void {
    this.cdkScrollable.ngOnDestroy();
  }
}
