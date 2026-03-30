import {Component, Input, OnDestroy, OnInit, TemplateRef, ViewChild, ViewEncapsulation} from '@angular/core';
import {MuiPageLayoutComponent} from './page-layout.component';

@Component({
  standalone: false,
  selector: 'm-page-bar',
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-template #content>
      <ng-content></ng-content>
    </ng-template>
  `,
  host: {
    class: 'm-page-bar'
  }
})
export class MuiPageBarComponent implements OnInit, OnDestroy {
  @Input() public mPosition: 'top' | 'bottom' | string;
  @ViewChild('content') public ngContent: TemplateRef<any>;

  private ref: () => void;

  public constructor(
    private pageLayout: MuiPageLayoutComponent
  ) {}

  public ngOnInit(): void {
    this.ref = this.pageLayout.registerBar(this);
  }

  public ngOnDestroy(): void {
    this.ref?.();
  }
}
