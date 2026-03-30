import {CdkTreeNodeToggle} from '@angular/cdk/tree';
import {Directive} from '@angular/core';

@Directive({
  standalone: false,
  selector: 'm-tree-node-toggle[mTreeNodeNoopToggle], [mTreeNodeNoopToggle]',
  host: {
    class: 'm-tree-toggle m-tree-toggle--noop'
  }
})
export class MuiTreeNodeNoopToggleDirective {}

@Directive({
  standalone: false,
  selector: 'm-tree-node-toggle:not([mTreeNodeNoopToggle]), [mTreeNodeToggle]',
  host: {
    class: 'm-tree-toggle',
    '[class.m-tree-toggle--open]': 'isExpanded',
    '[class.m-tree-toggle--close]': '!isExpanded'
  },
  providers: [{provide: CdkTreeNodeToggle, useExisting: MuiTreeNodeToggleDirective}]
})
export class MuiTreeNodeToggleDirective<T, K = T> extends CdkTreeNodeToggle<T, K> {
  public static override ngAcceptInputType_recursive: boolean | string;

  public get isExpanded(): boolean {
    return this._treeNode.isExpanded;
  }
}

@Directive({
  standalone: false,
  selector: 'm-icon[mTreeNodeToggleRotateIcon]',
  host: {
    class: 'm-tree-toggle-icon'
  }
})
export class MuiTreeNodeToggleRotateIconDirective {
}
