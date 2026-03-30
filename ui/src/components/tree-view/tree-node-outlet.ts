import {CDK_TREE_NODE_OUTLET_NODE, CdkTreeNodeOutlet} from '@angular/cdk/tree';
import {Directive, Inject, Optional, ViewContainerRef} from '@angular/core';

@Directive({
  standalone: false,
  selector: '[mTreeNodeOutlet]',
  providers: [{provide: CdkTreeNodeOutlet, useExisting: MuiTreeNodeOutlet}]
})
// eslint-disable-next-line @angular-eslint/directive-class-suffix
export class MuiTreeNodeOutlet implements CdkTreeNodeOutlet {
  public constructor(
    public viewContainer: ViewContainerRef,
    @Inject(CDK_TREE_NODE_OUTLET_NODE) @Optional() public _node?: any,
  ) {}
}
