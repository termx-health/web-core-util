import {CdkTree} from '@angular/cdk/tree';
import {Component, Input, ViewChild} from '@angular/core';
import {MuiTree} from './tree.base';
import {treeCollapseMotion} from './tree.animation';
import {MuiTreeNodeOutlet} from './tree-node-outlet';


@Component({
  standalone: false,
  selector: 'm-tree-view',
  template: `
    <div
        [@treeCollapseMotion]="_nodeOutlet.viewContainer.length"
        [@.disabled]="!mAnimate"
        class="m-tree-holder"
    >
      <ng-container mTreeNodeOutlet></ng-container>
    </div>
  `,
  host: {
    class: 'm-tree',
    role: 'tree',
  },
  providers: [
    {provide: CdkTree, useExisting: MuiTreeViewComponent},
    {provide: MuiTree, useExisting: MuiTreeViewComponent},
  ],
  animations: [treeCollapseMotion]
})
export class MuiTreeViewComponent<T> extends MuiTree<T> {
  public static ngAcceptInputType_mAnimate: boolean | string;

  @Input() public mAnimate = true;
  @ViewChild(MuiTreeNodeOutlet, {static: true}) public override _nodeOutlet: MuiTreeNodeOutlet;
}
