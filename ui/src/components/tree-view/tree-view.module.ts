import {MuiTree} from './tree.base';
import {NgModule} from '@angular/core';
import {CdkTreeModule} from '@angular/cdk/tree';
import {MuiTreeViewComponent} from './tree-view';
import {MuiTreeNodeOutlet} from './tree-node-outlet';
import {MuiTreeNodeComponent, MuiTreeNodeDef} from './tree-node';
import {MuiTreeNodePaddingDirective} from './tree-node-padding';
import {MuiTreeNodeNoopToggleDirective, MuiTreeNodeToggleDirective, MuiTreeNodeToggleRotateIconDirective} from './tree-node-toggle';
import {MuiTreeNodeIndentLineDirective, MuiTreeNodeIndentsComponent} from './tree-node-indent';
import {CommonModule} from '@angular/common';
import {CoreUtilModule} from '@termx-health/core-util';
import {MuiTreeNodeOptionComponent} from './tree-node-option';

const MUI_TREE_DIRECTIVES = [
  MuiTree,
  MuiTreeNodeComponent,
  MuiTreeNodeDef,
  MuiTreeNodeIndentLineDirective,
  MuiTreeNodeIndentsComponent,
  MuiTreeNodeNoopToggleDirective,
  MuiTreeNodeOptionComponent,
  MuiTreeNodeOutlet,
  MuiTreeNodePaddingDirective,
  MuiTreeNodeToggleDirective,
  MuiTreeNodeToggleRotateIconDirective,
  MuiTreeViewComponent,
];

@NgModule({
  imports: [CdkTreeModule, CommonModule, CoreUtilModule],
  exports: [MUI_TREE_DIRECTIVES],
  declarations: MUI_TREE_DIRECTIVES,
})
export class MuiTreeViewModule {
}
