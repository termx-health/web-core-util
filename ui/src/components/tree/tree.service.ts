import {EventEmitter, Injectable, OnDestroy} from '@angular/core';
import {isNil, remove} from '@termx-health/core-util';
import {DataSource, SelectionModel} from '@angular/cdk/collections';
import {FlatTreeControl, TreeControl} from '@angular/cdk/tree';
import {getParent, NzTreeViewFlatDataSource, NzTreeFlattener} from 'ng-zorro-antd/tree-view';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {MuiTreeNode, MuiTreeNodeOptions} from './tree.base';


@Injectable()
export class MuiTreeService implements OnDestroy {
  private _nodeMap = new Map<string, MuiTreeNode>();

  private transformer = (node: MuiTreeNodeOptions, level: number): MuiTreeNode => {
    const srvc = this;
    const key = node.key;

    const composeNode = (): MuiTreeNode => ({
      _origin: node,

      level: level,
      key: key,
      title: node.title,

      selectable: node.selectable ?? true,
      expandable: node.expandable || node.children?.length > 0,
      disabled: node.disabled,

      get data(): any {
        return node.data;
      },

      get isLeaf(): boolean {
        return !this.expandable;
      },
      get isExpanded(): boolean {
        return srvc._treeControl.isExpanded(this);
      },
      get isSelected(): boolean {
        return srvc._selectionModel.isSelected(this);
      },

      parentNode(): MuiTreeNode | null {
        const nodes = srvc.treeControl.dataNodes;
        const getLevel = srvc.treeControl.getLevel;
        return getParent(nodes, srvc._nodeMap.get(this.key), getLevel);
      },
      getChildren(): MuiTreeNode[] {
        return this._origin.children?.map(c => srvc._nodeMap.get(c.key)) || [];
      },
      setChildren(children: MuiTreeNodeOptions[]): void {
        const _prevChildren = this.getChildren();
        this._origin.children = children ?? [];

        node['rerender'] = _prevChildren.length === 0 || children.length === 0;
        this.expandable = this._origin.children.length > 0;

        srvc.setData(srvc._dataSource.getData());
      },

      expand(): void {
        srvc.expand(this.key);
      },
      collapse(): void {
        srvc.collapse(this.key);
      }
    });

    const existingNode = this._nodeMap.get(key);
    const shouldRecreate = !existingNode ||
      existingNode._origin !== node ||
      existingNode.level !== level ||
      existingNode.key !== key ||
      existingNode._origin?.children?.length === 0 && node.children?.length > 0 ||
      existingNode._origin?.children?.length > 0 && node.children?.length === 0 ||
      node['rerender'];

    const flatNode: MuiTreeNode = shouldRecreate ? composeNode() : existingNode;
    flatNode.title = node.title;
    node['rerender'] = undefined;

    this._nodeMap.set(key, flatNode);
    return flatNode;
  };


  private readonly _treeControl = new FlatTreeControl<MuiTreeNode>(node => node.level, node => node.expandable);
  private readonly _treeFlattener = new NzTreeFlattener(this.transformer, node => node.level, node => node.expandable, node => node.children);
  private readonly _dataSource = new NzTreeViewFlatDataSource(this._treeControl as any, this._treeFlattener);

  private readonly _selectionModel = new SelectionModel<MuiTreeNode>(true);
  private readonly _destroy$ = new Subject<void>();

  public selectedKeysChange = new EventEmitter<string[]>();
  public expandedKeysChange = new EventEmitter<string[]>();
  public expandChange = new EventEmitter<MuiTreeNode>();

  public constructor() {
    this.subscribeToChanges();
  }

  public ngOnDestroy(): void {
    this._destroy$.next();
    this._destroy$.complete();
  }

  private subscribeToChanges(): void {
    this._selectionModel.changed.pipe(takeUntil(this._destroy$)).subscribe(() => {
      this.selectedKeysChange.emit(this.selectedKeys);
    });

    this._treeControl.expansionModel.changed.pipe(takeUntil(this._destroy$)).subscribe(evt => {
      this.expandedKeysChange.emit(this.expandedKeys);

      const keyCount = [...evt.added, ...evt.removed].reduce((acc, c) => ({
        ...acc,
        [c.key]: (acc[c.key] || 0) + 1
      }), {});
      const validKeys = Object.keys(keyCount).filter(k => keyCount[k] === 1);

      // Only the values that are not present in the added and removed lists are emitted.
      // If lists contain the same value, it means that nothing has changed.
      [...evt.added, ...evt.removed]
        .filter(n => validKeys.includes(n.key))
        .filter(n => n.expandable)
        .forEach(n => this.expandChange.emit(n));
    });
  }


  private get selectedKeys(): string[] {
    return this._selectionModel.selected.map(n => n.key);
  }

  private get expandedKeys(): string[] {
    return this._treeControl.expansionModel.selected.filter(n => n.expandable).map(n => n.key);
  }


  /* Select API */

  public conductSelectedKeys(keys: string[], multi: boolean = true): void {
    keys ??= [];
    if (!multi) {
      keys = keys.slice(0, 1);
    }

    const nodes = [...this._nodeMap.entries()].filter(([k]) => keys.includes(k)).map(e => e[1]);
    this._selectionModel.setSelection(...nodes);
  }

  public toggleSelected(node: MuiTreeNode, multi: boolean): void {
    if (!node.selectable) {
      return;
    }

    const isSelected = this._selectionModel.isSelected(node);

    if (!multi) {
      // We could use a _selectionModel.toggle() method, but for that, we would need to create a new SelectionModel instance each time the mMultiple changes,
      // which would lead to the creation of a new change subscription. TL-TR: Didn't want to handle subscriptions
      this._selectionModel.clear(false);
    }

    if (isSelected) {
      this._selectionModel.deselect(node);
    } else {
      this._selectionModel.select(node);
    }
  }


  /* Expand API */

  public conductExtendedKeys(keys: string[]): void {
    keys ??= [];
    const nodes = [...this._nodeMap.entries()].filter(([k]) => keys.includes(k)).map(e => e[1]);
    this._treeControl.expansionModel.setSelection(...nodes);
  }


  /* Public API */

  public getNodeByKey(key: string): MuiTreeNode {
    return this._nodeMap.get(key);
  }

  public setData(data: MuiTreeNodeOptions[]): void {
    this._dataSource.setData(data);
    setTimeout(() => this.cleanupChildren());
  }

  public getChildren(key?: string): MuiTreeNode[] {
    if (isNil(key)) {
      return this._dataSource.getData().map(n => this._nodeMap.get(n.key));
    }
    return this.getNodeByKey(key)?.getChildren();
  }

  public setChildren(key: string, children: MuiTreeNodeOptions[]): void {
    if (isNil(key)) {
      return;
    }

    const parent = this.getNodeByKey(key);
    if (parent) {
      parent.setChildren(children);
    }
  }

  public removeChild(key: string): void {
    const parent = this.getNodeByKey(key)?.parentNode();
    if (parent) {
      const _children = parent.getChildren().map(n => n._origin);
      parent.setChildren(_children.filter(n => n.key !== key));
    }
    this._nodeMap.delete(key);
  }

  /* Removes/frees every child that isn't in 'children' */
  private cleanupChildren(): void {
    const existing = this._treeControl.dataNodes.map(dn => dn.key);
    const selectedKeys = this.selectedKeys;
    const expandedKeys = this.expandedKeys;
    const combinedKeys = [...selectedKeys, ...expandedKeys];

    const nodesToRemove = combinedKeys.filter(k => !existing.includes(k));
    nodesToRemove.forEach(k => {
      remove(selectedKeys, k);
      remove(expandedKeys, k);
      this._nodeMap.delete(k);
    });

    this.conductSelectedKeys(selectedKeys);
    this.conductExtendedKeys(expandedKeys);
  }

  // expand
  public expandAll(): void {
    this._treeControl.expandAll();
  }

  public expand(key: string): void {
    const node = this.getNodeByKey(key);
    if (node && node.expandable) {
      this._treeControl.expand(node);
    }
  }

  public expandDescendants(key: string): void {
    const node = this.getNodeByKey(key);
    if (node && node.expandable) {
      this._treeControl.expandDescendants(node);
    }
  }

  // collapse
  public collapseAll(): void {
    this._treeControl.collapseAll();
  }

  public collapse(key: string): void {
    const node = this.getNodeByKey(key);
    if (node && node.expandable) {
      this._treeControl.collapse(node);
    }
  }

  public collapseDescendants(key: string): void {
    const node = this.getNodeByKey(key);
    if (node && node.expandable) {
      this._treeControl.collapseDescendants(node);
    }
  }


  /* Getters */

  public get dataSource(): DataSource<MuiTreeNode> {
    return this._dataSource;
  }

  public get treeControl(): TreeControl<MuiTreeNode> {
    return this._treeControl;
  }
}
