import {Component, Input, ViewEncapsulation} from '@angular/core';
import {ICONS} from './icons';

@Component({
  standalone: false,
  selector: 'm-icon',
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-container *ngIf="!icons[mCode]">
      ({{mCode}})
    </ng-container>

    <ng-container [ngSwitch]="icons[mCode]?.source">
      <ng-container *ngSwitchCase="'zorro'">
        <i
            [class]="mIconClass" [style]="mSize ? 'font-size: ' + mSize + 'px' : ''"
            nz-icon
            [nzType]="mCode"
            [nzTheme]="options['nzTheme'] || 'outline'"
        ></i>
      </ng-container>
    </ng-container>
  `
})
export class MuiIconComponent {
  @Input() public mCode?: string;
  @Input() public mIconClass: string = 'default-m-icon';
  @Input() public mSize?: string | number;
  @Input() public mOptions?: any;

  public icons = ICONS;

  public get options(): any {
    return this.mOptions || this.icons?.[this.mCode];
  }
}
