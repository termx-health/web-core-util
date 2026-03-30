import {Component, ContentChild, Input, OnChanges, TemplateRef} from '@angular/core';
import {NgChanges} from '../core';

@Component({
  standalone: false,
  selector: 'm-editable-column',
  template: `
    <ng-content></ng-content>
  `
})
export class MuiEditableTableColumnComponent implements OnChanges {
  @Input() public mName: string;
  @Input() public mTitle: string;
  @Input() public mSort: string;
  @Input() public mOrder?: number;
  @Input() public mCellEditable: (item) => boolean = () => true;
  @Input() public mColumnVisible: ('edit' | 'view')[] | 'edit' | 'view' = ['edit', 'view'];
  private _columnVisible = this.mColumnVisible;

  @Input() public mWidth?: string;
  @Input() public mSpan = 1;
  @Input() public mViewSpan = 1;
  @Input() public mTextAlign: 'left' | 'right' | 'center' = 'left';

  @ContentChild('headerTemplate') public headerTemplate: TemplateRef<any>;
  @ContentChild('viewTemplate') public viewTemplate: TemplateRef<any>;
  @ContentChild('editTemplate') public editTemplate: TemplateRef<any>;


  public ngOnChanges(changes: NgChanges<MuiEditableTableColumnComponent>): void {
    const {mColumnVisible} = changes;
    if (mColumnVisible) {
      this._columnVisible = typeof this.mColumnVisible === 'string' ? [this.mColumnVisible] : this.mColumnVisible;
    }
  }

  public get columnEditVisible(): boolean {
    return this._columnVisible?.includes('edit');
  }

  public get columnViewVisible(): boolean {
    return this._columnVisible?.includes('view');
  }
}
