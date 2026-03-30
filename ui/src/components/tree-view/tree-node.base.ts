import {CdkTreeNode,} from '@angular/cdk/tree';


export abstract class MuiNodeBase<T> extends CdkTreeNode<T> {
  public abstract setIndents(indents: boolean[]): void;

  public abstract isLeaf: boolean;
}

