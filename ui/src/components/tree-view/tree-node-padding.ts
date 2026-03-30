import {NumberInput} from '@angular/cdk/coercion';
import {CdkTreeNodePadding} from '@angular/cdk/tree';
import {Directive, Input} from '@angular/core';


@Directive({
  standalone: false,
  selector: 'm-tree-node[mTreeNodePadding]',
  providers: [{provide: CdkTreeNodePadding, useExisting: MuiTreeNodePaddingDirective}],
})
export class MuiTreeNodePaddingDirective<T, K = T> extends CdkTreeNodePadding<T, K> {
  public override _indent = 24;

  @Input('mTreeNodePaddingLevel')
  public override get level(): number {
    return this._level;
  }

  public override set level(value: NumberInput ) {
    this._setLevelInput(Number(value));
  }

  @Input('mTreeNodePaddingIndent')
  public override get indent(): number | string {
    return this._indent;
  }

  public override set indent(indent: number | string) {
    this._setIndentInput(indent);
  }
}
