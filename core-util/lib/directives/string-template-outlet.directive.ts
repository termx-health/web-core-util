import {Directive, EmbeddedViewRef, Input, OnChanges, SimpleChange, SimpleChanges, TemplateRef, ViewContainerRef} from '@angular/core';

type Any = any;

@Directive({
  selector: '[stringTemplateOutlet]',
})
export class StringTemplateOutletDirective implements OnChanges {
  private embeddedViewRef: EmbeddedViewRef<Any> | null = null;
  private context = {$implicit: null};

  @Input() public stringTemplateOutletContext: Any | null = null;
  @Input() public stringTemplateOutlet: Any | TemplateRef<Any> | null = null;

  public constructor(private viewContainer: ViewContainerRef, private templateRef: TemplateRef<Any>) {}

  public ngOnChanges(changes: SimpleChanges): void {
    const {stringTemplateOutlet, stringTemplateOutletContext} = changes;

    const hasOutletChanged = (outletChange: SimpleChange): boolean => {
      if (outletChange) {
        if (outletChange.firstChange) {
          return true;
        }
        const isPrevTemplateRef = outletChange.previousValue instanceof TemplateRef;
        const isCurTemplateRef = outletChange.currentValue instanceof TemplateRef;
        return isPrevTemplateRef || isCurTemplateRef;
      }
      return false;
    };

    const hasContextChanged = (contextChange: SimpleChange): boolean => {
      if (contextChange) {
        const prevCtxKeys = Object.keys(contextChange.previousValue || {}).sort();
        const curCtxKeys = Object.keys(contextChange.currentValue || {}).sort();
        if (prevCtxKeys.length === curCtxKeys.length) {
          return curCtxKeys.some((v, i) => v !== prevCtxKeys[i]);
        }
      }
      return false;
    };

    const shouldRecreateView = (): boolean => {
      return hasOutletChanged(stringTemplateOutlet) || hasContextChanged(stringTemplateOutletContext);
    };


    if (stringTemplateOutlet) {
      this.context.$implicit = stringTemplateOutlet.currentValue;
    }

    if (shouldRecreateView()) {
      this.recreateView();
    } else {
      this.updateContext();
    }
  }


  private recreateView(): void {
    this.viewContainer.clear();

    const isTemplateRef = this.stringTemplateOutlet instanceof TemplateRef;
    const templateRef = isTemplateRef ? this.stringTemplateOutlet : this.templateRef;
    const context = isTemplateRef ? this.stringTemplateOutletContext : this.context;

    this.embeddedViewRef = this.viewContainer.createEmbeddedView(templateRef, context);
  }

  private updateContext(): void {
    const isTemplateRef = this.stringTemplateOutlet instanceof TemplateRef;
    const newCtx = isTemplateRef ? this.stringTemplateOutletContext : this.context;
    const oldCtx = this.embeddedViewRef!.context;

    if (newCtx) {
      for (const propName of Object.keys(newCtx)) {
        oldCtx[propName] = newCtx[propName];
      }
    }
  }
}

