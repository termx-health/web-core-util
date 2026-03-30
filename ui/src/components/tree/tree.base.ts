export interface MuiTreeNodeOptions<T = {}> {
  key: string;
  title?: string;
  children?: MuiTreeNodeOptions<T>[];

  // icon?: string;
  disabled?: boolean;
  expandable?: boolean; // set 'true' if children will be loaded asynchronously
  selectable?: boolean; // whether node can be selected, by default is 'true'

  data?: T;

  [key: string]: any;
}


export declare class MuiTreeNode<T = {}> {
  public readonly _origin: MuiTreeNodeOptions<T>;

  public readonly level?: number;
  public readonly key: string;
  public title?: string;

  public readonly selectable?: boolean; // isLeaf(), isExpanded()
  public expandable?: boolean; // isSelected()
  public loading?: boolean;
  public disabled?: boolean;

  public get data(): T;

  public get isLeaf(): boolean;

  public get isExpanded(): boolean;

  public get isSelected(): boolean;


  public parentNode(): MuiTreeNode<T> | null;

  public getChildren(): MuiTreeNode<T>[];

  public setChildren(children: MuiTreeNodeOptions<T>[]): void;


  public expand(): void;

  public collapse(): void;
}

