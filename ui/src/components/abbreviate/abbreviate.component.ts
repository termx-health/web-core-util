import {Component, Input, OnChanges} from '@angular/core';
import {AbbreviatePipe} from '@termx-health/core-util';

@Component({
  standalone: false,
  selector: 'm-abbreviate',
  template: `
    <span m-tooltip [mTooltip]="abbreviated" [mTitle]="mValue">{{abbreviatedText}}</span>
  `
})
export class MuiAbbreviateComponent implements OnChanges {
  @Input() public mValue?: string;
  @Input() public mLength?: number | string;
  @Input() public mThreshold?: number | string = 0;

  public abbreviatedText: string;
  public abbreviated: boolean;


  public ngOnChanges(): void {
    this.abbreviatedText = this.mValue ?? '';
    this.abbreviated = false;

    if (this.mLength) {
      const _limit = Number(this.mLength);
      const _threshold = Number(this.mThreshold);
      if (this.abbreviatedText.length <= _limit + _threshold) {
        return;
      }
      this.abbreviatedText = new AbbreviatePipe().transform(this.abbreviatedText, _limit);
      this.abbreviated = true;
    }
  }
}
