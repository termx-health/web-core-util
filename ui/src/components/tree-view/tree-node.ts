import {CdkTreeNode, CdkTreeNodeDef,} from '@angular/cdk/tree';
import {Component, Directive, ElementRef, Input, OnInit,} from '@angular/core';
import {MuiTree} from './tree.base';
import {MuiNodeBase} from './tree-node.base';


@Component({
  standalone: false,
  selector: 'm-tree-node',
  template: `
    <m-tree-node-indents [indents]="indents" *ngIf="indents"></m-tree-node-indents>
    <ng-content select="m-tree-node-toggle, [m-tree-node-toggle]"></ng-content>
    <ng-content select="m-tree-node-option"></ng-content>
    <ng-content></ng-content>
  `,
  host: {
    class: 'm-tree-node',
    '[class.m-tree-node--selected]': 'isSelected',
    '[class.m-tree-node--disabled]': 'isDisabled',
  },
  providers: [
    {provide: CdkTreeNode, useExisting: MuiTreeNodeComponent},
    {provide: MuiNodeBase, useExisting: MuiTreeNodeComponent},
  ]
})
export class MuiTreeNodeComponent<T> extends MuiNodeBase<T> implements OnInit {
  public indents: boolean[];
  public isLeaf = false;
  public override isDisabled = false;
  public isSelected = false;

  public constructor(
    protected elementRef: ElementRef<HTMLElement>,
    protected tree: MuiTree<T>,
  ) {
    super(elementRef, tree);
  }

  public override ngOnInit(): void {
    this.isLeaf = !this.tree.treeControl.isExpandable(this.data);
  }

  public setIndents(indents: boolean[]): void {
    this.indents = indents;
  }

  public disable(): void {
    this.isDisabled = true;
  }

  public enable(): void {
    this.isDisabled = false;
  }

  public select(): void {
    this.isSelected = true;
  }

  public deselect(): void {
    this.isSelected = false;
  }
}

@Directive({
  standalone: false,
  selector: '[mTreeNodeDef]',
  providers: [{provide: CdkTreeNodeDef, useExisting: MuiTreeNodeDef}],
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class MuiTreeNodeDef<T> extends CdkTreeNodeDef<T> {
  @Input('mTreeNodeDefWhen') public override when!: (index: number, nodeData: T) => boolean;
}
