import {Component, Directive, Input, OnDestroy} from '@angular/core';
import {animationFrameScheduler, asapScheduler, merge, Subscription} from 'rxjs';
import {auditTime} from 'rxjs/operators';
import {MuiNodeBase} from './tree-node.base';
import {getNextSibling, getParent} from 'ng-zorro-antd/tree-view';
import {MuiTree} from './tree.base';


function booleanArrayToString(arr: boolean[]): string {
  return arr.map(i => (i ? 1 : 0)).join('');
}

const BUILD_INDENTS_SCHEDULER = typeof requestAnimationFrame !== 'undefined' ? animationFrameScheduler : asapScheduler;

@Component({
  standalone: false,
  selector: 'm-tree-node-indents',
  template: `
    <span
        class="m-tree-indent-unit"
        [class.m-tree-indent--vertical-line]="hasLine"
        *ngFor="let hasLine of indents"
    ></span>

    <span class="m-tree-indent-unit m-tree-indent--vertical-line m-tree-indent--horizontal-line"></span>
  `,
  host: {
    class: 'm-tree-indent'
  }
})
export class MuiTreeNodeIndentsComponent {
  @Input() public indents: boolean[] = [];
}


@Directive({
  standalone: false,
  selector: 'm-tree-node[mTreeNodeIndentLine]',
  host: {
    '[class.m-tree-indent--show-line]': 'mShowLine',
    '[class.m-tree-indent--last-row]': 'isLast'
  }
})
export class MuiTreeNodeIndentLineDirective<T> implements OnDestroy {
  @Input() public mShowLine: boolean = true;
  protected isLast: boolean | 'unset' = 'unset';

  private currentIndents: string = '';
  private changeSubscription: Subscription;

  public constructor(private treeNode: MuiNodeBase<T>, private tree: MuiTree<T>,) {
    this.changeSubscription = merge(this.treeNode._dataChanges, this.tree._dataSourceChanged).pipe(
      auditTime(0, BUILD_INDENTS_SCHEDULER),
    ).subscribe(() => {
      this.buildIndents();
    });
  }

  private buildIndents(): void {
    if (this.treeNode.data) {
      const nodes = this.tree.treeControl.dataNodes;
      const getLevel = this.tree.treeControl.getLevel;
      this.isLast = !getNextSibling(nodes, this.treeNode.data, getLevel);

      const indents = this.getIndents();
      const diffString = booleanArrayToString(indents);
      if (diffString !== this.currentIndents) {
        this.treeNode.setIndents(indents.slice(1, indents.length));
        this.currentIndents = diffString;
      }
    }
  }

  private getIndents(): boolean[] {
    const indents = [];
    const nodes = this.tree.treeControl.dataNodes;
    const getLevel = this.tree.treeControl.getLevel;

    let parent = getParent(nodes, this.treeNode.data, getLevel);
    while (parent) {
      const parentNextSibling = getNextSibling(nodes, parent, getLevel);
      if (parentNextSibling) {
        indents.unshift(true);
      } else {
        indents.unshift(false);
      }
      parent = getParent(nodes, parent, getLevel);
    }

    return indents;
  }

  public ngOnDestroy(): void {
    this.changeSubscription.unsubscribe();
  }
}
