import {Component, DestroyRef, EventEmitter, Input, OnChanges, Output, TemplateRef} from '@angular/core';
import {BooleanInput, remove} from '@termx-health/core-util';
import {NgChanges} from '../core';
import {throttleTime} from 'rxjs/operators';
import {MuiTreeService} from './tree.service';
import {MuiTreeNode, MuiTreeNodeOptions} from './tree.base';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';


@Component({
  standalone: false,
  selector: 'm-tree',
  template: `
    <m-tree-view [mDataSource]="treeService.dataSource" [mTreeControl]="treeService.treeControl" [mAnimate]="mAnimate">
      <m-tree-node *mTreeNodeDef="let node" mTreeNodeIndentLine [mShowLine]="mShowLine">
        <m-tree-node-option
          class="m-tree-node__option--leaf"
          [class.m-tree-node__option--selectable]="node.selectable"
          [mDisabled]="node.disabled"
          [mSelected]="node.isSelected"
          (mClick)="onNodeClick(node)"
        >
          <ng-container *ngTemplateOutlet="option, context {node: node}"></ng-container>
        </m-tree-node-option>
      </m-tree-node>

      <m-tree-node *mTreeNodeDef="let node; when: hasChild" mTreeNodeIndentLine [mShowLine]="mShowLine">
        <m-tree-node-toggle *ngIf="mShowExpand">
          <ng-container *ngIf="mExpandIcon; else icon">
            <ng-template [ngTemplateOutlet]="mExpandIcon" [ngTemplateOutletContext]="{$implicit: node}"></ng-template>
          </ng-container>

          <ng-template #icon>
            <m-icon *ngIf="node.loading" mCode="loading"></m-icon>
            <m-icon *ngIf="!node.loading" mCode="caret-down" mTreeNodeToggleRotateIcon style="font-size: 0.8rem; line-height: 0.8rem;"></m-icon>
          </ng-template>
        </m-tree-node-toggle>

        <m-tree-node-option
          [class.m-tree-node__option--selectable]="node.selectable"
          [mDisabled]="node.disabled"
          [mSelected]="node.isSelected"
          (mClick)="onNodeClick(node)"
        >
          <ng-container *ngTemplateOutlet="option; context {node: node}"></ng-container>
        </m-tree-node-option>
      </m-tree-node>
    </m-tree-view>

    <ng-template #option let-node="node">
      <ng-container *ngIf="mOption; else def">
        <ng-template
          [ngTemplateOutlet]="mOption"
          [ngTemplateOutletContext]="{$implicit: node, data: node.data}"
        ></ng-template>
      </ng-container>

      <ng-template #def>{{node.title}}</ng-template>
    </ng-template>
  `,
  providers: [MuiTreeService]
})
export class MuiTreeComponent<T = {}> implements OnChanges {
  public static ngAcceptInputType_mSelectMode: boolean | string;
  public static ngAcceptInputType_mAsyncData: boolean | string;
  public static ngAcceptInputType_mShowLine: boolean | string;
  public static ngAcceptInputType_mExpandAll: boolean | string;
  public static ngAcceptInputType_mShowExpand: boolean | string;
  public static ngAcceptInputType_mMultiple: boolean | string;
  public static ngAcceptInputType_mAnimate: boolean | string;

  @Input() public mData: MuiTreeNodeOptions<T>[] = [];
  @Input() public mExpandedKeys: string[] = [];
  @Input() public mSelectedKeys: string[] = [];
  @Input() @BooleanInput() public mAsyncData: boolean;
  @Input() @BooleanInput() public mShowLine: boolean = true;
  @Input() @BooleanInput() public mExpandAll: boolean;
  @Input() @BooleanInput() public mShowExpand: boolean = true;
  @Input() @BooleanInput() public mSelectMode: boolean;
  @Input() @BooleanInput() public mMultiple: boolean;
  @Input() @BooleanInput() public mAnimate: boolean = true;

  @Input() public mOption: TemplateRef<any>;
  @Input() public mExpandIcon: TemplateRef<any>;

  @Output() public mExpandedKeysChange = new EventEmitter<string[]>();
  @Output() public mSelectedKeysChange = new EventEmitter<string[]>();

  @Output() public mClick = new EventEmitter<MuiTreeNode<T>>();
  @Output() public mSelect = new EventEmitter<MuiTreeNode<T>>();
  @Output() public mExpand = new EventEmitter<MuiTreeNode<T>>();

  protected hasChild = (_: number, node: MuiTreeNode<T>): boolean => node.expandable;

  public constructor(
    protected treeService: MuiTreeService,
    private destroyRef: DestroyRef
  ) {
    this.initSubscriptions();
  }

  public ngOnChanges(changes: NgChanges<MuiTreeComponent<T>>): void {
    const {mData, mExpandAll, mMultiple, mSelectedKeys, mExpandedKeys} = changes;
    if (mData) {
      this.treeService.setData(this.mData);
      this.updateSelectState();
      this.updateExtendState();
    }


    // select
    if (mSelectedKeys) {
      this.updateSelectState();
    }
    if (mMultiple) {
      this.updateSelectState();
    }

    // expand
    if (mExpandedKeys) {
      this.updateExtendState();
    }
    if (mExpandAll && this.mExpandAll) {
      this.expandAll();
    }
  }

  private updateSelectState(): void {
    if (this.mSelectMode) {
      this.treeService.conductSelectedKeys(this.mSelectedKeys, this.mMultiple);
    }
  }

  private updateExtendState(): void {
    this.treeService.conductExtendedKeys(this.mExpandedKeys);
  }


  protected onNodeClick(node: MuiTreeNode<T>): void {
    this.mClick.emit(node);

    if (this.mSelectMode && node.selectable) {
      this.treeService.toggleSelected(node, this.mMultiple);
      this.mSelect.emit(node);
    }
  }

  protected onNodeExpand(node: MuiTreeNode<T>): void {
    // called after node got expanded in the tree control

    if (this.mAsyncData && node.expandable && node.getChildren().length === 0 && node.isExpanded) {
      node.loading = true;
    }

    this.mExpand.emit(node);
  }

  /* Public API */

  public getNodeByKey(key: string): MuiTreeNode<T> {
    return this.treeService.getNodeByKey(key) as MuiTreeNode<T>;
  }

  public getNodeChildren(key?: string): MuiTreeNode<T>[] {
    return this.treeService.getChildren(key) as MuiTreeNode<T>[];
  }

  public setNodeChildren(key: string, children: MuiTreeNodeOptions[]): void {
    this.treeService.setChildren(key, children);
  }

  public removeNodeByKey(key: string): void {
    this.treeService.removeChild(key);
  }

  // expand
  public expandAll(): void {
    this.treeService.expandAll();
  }

  public expand(key: string): void {
    this.treeService.expand(key);
  }

  public expandDescendants(key: string): void {
    this.treeService.expandDescendants(key);
  }

  // collapse
  public collapseAll(): void {
    this.treeService.collapseAll();
  }

  public collapse(key: string): void {
    this.treeService.collapse(key);
  }

  public collapseDescendants(key: string): void {
    this.treeService.collapseDescendants(key);
  }


  // select/unselect
  public select(key: string, unselectOthers = false): void {
    this.treeService.conductSelectedKeys([key, ...this.mSelectedKeys], unselectOthers ? false : this.mMultiple);
  }

  public unselect(key: string): void {
    this.treeService.conductSelectedKeys(remove(this.mSelectedKeys, key), this.mMultiple);
  }

  /* Misc */


  private initSubscriptions(): void {
    this.treeService.selectedKeysChange.pipe(
      takeUntilDestroyed(this.destroyRef),
      throttleTime(0)
    ).subscribe(keys => {
      this.mSelectedKeys = keys;
      this.mSelectedKeysChange.observed && this.mSelectedKeysChange.emit(keys);
    });

    this.treeService.expandedKeysChange.pipe(
      takeUntilDestroyed(this.destroyRef),
      throttleTime(0)
    ).subscribe(keys => {
      this.mExpandedKeys = keys;
      this.mExpandedKeysChange.observed && this.mExpandedKeysChange.emit(keys);
    });

    this.treeService.expandChange.pipe(
      takeUntilDestroyed(this.destroyRef),
    ).subscribe(n => {
      this.mExpand.observed && this.onNodeExpand(n as MuiTreeNode<T>);
    });
  }
}
