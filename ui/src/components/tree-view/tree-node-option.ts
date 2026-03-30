import {Component, EventEmitter, Input, OnChanges, Output} from '@angular/core';
import {InputBoolean} from 'ng-zorro-antd/core/util';
import {MuiTreeNodeComponent} from './tree-node';
import {NgChanges} from '../core';


@Component({
  standalone: false,
  selector: 'm-tree-node-option',
  template: `<span class="m-tree-title"><ng-content></ng-content></span> `,
  host: {
    class: 'm-tree-node__option',
    '[class.m-tree-node__option--open]': 'isExpanded',
    '[class.m-tree-node__option--selected]': 'mSelected',
    '[class.m-tree-node__option--disabled]': 'mDisabled',
    '(click)': `onHostClick($event)`
  }
})
export class MuiTreeNodeOptionComponent<T> implements OnChanges {
  @Input() @InputBoolean() public mSelected = false;
  @Input() @InputBoolean() public mDisabled = false;
  @Output() public readonly mClick = new EventEmitter<MouseEvent>();

  public constructor(
    private treeNode: MuiTreeNodeComponent<T>
  ) {}

  public ngOnChanges(changes: NgChanges<MuiTreeNodeOptionComponent<T>>): void {
    const {mDisabled, mSelected} = changes;
    if (mDisabled) {
      if (mDisabled.currentValue) {
        this.treeNode.disable();
      } else {
        this.treeNode.enable();
      }
    }

    if (mSelected) {
      if (mSelected.currentValue) {
        this.treeNode.select();
      } else {
        this.treeNode.deselect();
      }
    }
  }

  protected onHostClick(e: MouseEvent): void {
    if (!this.mDisabled && this.mClick.observed) {
      this.mClick.emit(e);
    }
  }

  public get isExpanded(): boolean {
    return this.treeNode.isExpanded;
  }
}
