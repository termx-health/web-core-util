import {Component, Input} from '@angular/core';

@Component({
  standalone: false,
  selector: 'm-title',
  template:`
    <div class="m-justify-between">
      <div class="m-items-middle">
        <ng-container *ngIf="mTitle">
          {{mTitle  | i18n}}
        </ng-container>
        <ng-container *ngIf="!mTitle">
          <ng-content></ng-content>
        </ng-container>
      </div>
      <ng-content select="[mControls]"></ng-content>
    </div>
  `,
  host: {
    class: 'm-page-title'
  }
})
export class MuiPageTitleComponent {
  @Input() public mTitle: string;
}
