import {CdkTree, TreeControl} from '@angular/cdk/tree';
import {Component, Input, IterableDiffer, ViewContainerRef} from '@angular/core';
import {DataSource} from '@angular/cdk/collections';
import {Observable, Subject} from 'rxjs';


@Component({
  standalone: false,template: ``})
// eslint-disable-next-line @angular-eslint/component-class-suffix
export class MuiTree<T> extends CdkTree<T> {

  /* CDK tree implementation */

  @Input('mTreeControl')
  public override treeControl!: TreeControl<T, any>;

  @Input('mDataSource')
  public override get dataSource(): DataSource<T> | Observable<T[]> | T[] {
    return super.dataSource;
  }

  public override set dataSource(dataSource: DataSource<T> | Observable<T[]> | T[]) {
    super.dataSource = dataSource;
  }


  /* Custom hook */

  public _dataSourceChanged = new Subject<void>();

  public override renderNodeChanges(
    data: T[],
    dataDiffer?: IterableDiffer<T>,
    viewContainer?: ViewContainerRef,
    parentData?: T
  ): void {
    super.renderNodeChanges(data, dataDiffer, viewContainer, parentData);
    this._dataSourceChanged.next();
  }
}
