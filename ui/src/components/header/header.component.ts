import {Component, Input, TemplateRef, ViewEncapsulation} from '@angular/core';

@Component({
  standalone: false,
  selector: 'm-header',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="m-header-title">
      <ng-container *stringTemplateOutlet="mTitle">
        {{mTitle | toString | i18n}}
      </ng-container>
    </div>

    <div class="m-header-actions" *ngIf="mActions">
      <ng-template [ngTemplateOutlet]="mActions"></ng-template>
    </div>
  `,
  host: {
    '[class.m-header]': 'true'
  }
})
export class MuiHeaderComponent {
  @Input() public mTitle?: string | TemplateRef<any>;
  @Input() public mActions?: TemplateRef<any>;
}
