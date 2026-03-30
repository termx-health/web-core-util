import {Component, Input, OnChanges, SimpleChanges, ViewEncapsulation} from '@angular/core';
import {BooleanInput} from '@termx-health/core-util';


export type MuiTagPreset = string
  | 'red'
  | 'orange'
  | 'amber'
  | 'yellow'
  | 'lime'
  | 'green'
  | 'emerald'
  | 'teal'
  | 'cyan'
  | 'sky'
  | 'blue'
  | 'indigo'
  | 'violet'
  | 'fuchsia'
  | 'pink'
  | 'rose'
  | 'success' | 'info' | 'warning' | 'error';

@Component({
  standalone: false,
  selector: 'm-tag',
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="m-tag-container">
      <div class="m-tag-icon" *ngIf="_icon && mShowIcon">
        <m-icon [mCode]="_icon"></m-icon>
      </div>
      <div class="m-tag-text">
        <ng-container *ngIf="mLabel">
          {{mLabel | i18n}}
        </ng-container>
        <ng-container *ngIf="!mLabel">
          <ng-content></ng-content>
        </ng-container>
      </div>
    </div>

  `,
  host: {
    '[class]': '"m-tag-" + _color',
    '[class.m-tag]': `true`,
    '[class.m-tag-custom]': `!isColorPreset && _color`,
    '[style.background]': `!isColorPreset ? _color : null`
  }
})
export class MuiTagComponent implements OnChanges {
  public static ngAcceptInputType_mShowIcon: boolean | string;

  @Input() public mColor: string | MuiTagPreset;
  @Input() public mLabel: string;
  @Input() @BooleanInput() public mShowIcon: boolean;

  protected _color: string;
  protected _icon: string;

  private iconMap: { [type in MuiTagPreset]?: string } = {
    'success': 'check-circle',
    'info': 'info-circle',
    'warning': 'warning',
    'error': 'close-circle'
  };

  private statusMapping = {
    'success': 'green',
    'info': 'sky',
    'warning': 'amber',
    'error': 'red'
  };

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['mColor']) {
      this._color = this.statusMapping[this.mColor] ?? this.mColor;
      this._icon = this.iconMap[this.mColor];
    }
  }

  public get isColorPreset(): boolean {
    const presets = [
      'red', 'orange', 'amber', 'yellow',
      'lime', 'green', 'emerald', 'teal',
      'cyan', 'sky', 'blue', 'indigo',
      'violet', 'fuchsia', 'pink', 'rose',
      'success', 'info', 'warning', 'error'
    ];
    return presets.includes(this.mColor);
  }
}
