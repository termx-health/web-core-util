import {Component, ContentChild, Directive, Input, OnChanges, TemplateRef, ViewEncapsulation} from '@angular/core';
import {BooleanInput} from '@termx-health/core-util';
import {DEFAULT_CARD_CONFIG, MuiCardConfig, MuiConfigService} from '../../config';
import {NgChanges} from '../core';

export type MuiCardDisplay = string | 'raised' | 'flat' | 'bordered';

@Directive({standalone: false, selector: '[m-card-header], [mCardHeader]'})
export class MuiCardHeaderDirective {
  @Input() public mCardHeader: any = true;

  public constructor(public template: TemplateRef<any>, public host: MuiCardComponent) { }
}

@Directive({standalone: false, selector: '[m-card-content], [mCardContent]'})
export class MuiCardContentDirective {
  @Input() public mCardContent: any = true;

  public constructor(public template: TemplateRef<any>, public host: MuiCardComponent) { }
}

@Directive({standalone: false, selector: '[m-card-footer], [mCardFooter]'})
export class MuiCardFooterDirective {
  @Input() public mCardFooter: any = true;

  public constructor(public template: TemplateRef<any>, public host: MuiCardComponent) { }
}

@Component({
  standalone: false,
  selector: 'm-card',
  encapsulation: ViewEncapsulation.None,
  template: `
    <ng-container *ngIf="!mShowSkeleton">
      <div class="m-card__header" *ngIf="cardHeader?.mCardHeader">
        <ng-template [ngTemplateOutlet]="cardHeader.template"></ng-template>
      </div>

      <div class="m-card__header m-card__title-container" *ngIf="!cardHeader && mTitle">
        <div class="m-card__title">
          {{mTitle | i18n}}
        </div>
      </div>
    </ng-container>

    <div class="m-card__content">
      <m-skeleton [mLoading]="mShowSkeleton">
        <ng-container *ngIf="cardContent?.mCardContent; else ngContent">
          <ng-template [ngTemplateOutlet]="cardContent.template"></ng-template>
        </ng-container>

        <ng-template #ngContent>
          <ng-content></ng-content>
        </ng-template>
      </m-skeleton>
    </div>

    <div class="m-card__footer" *ngIf="cardFooter?.mCardFooter && !mShowSkeleton">
      <ng-template [ngTemplateOutlet]="cardFooter.template"></ng-template>
    </div>
  `,
  host: {
    class: 'm-card',
    '[class.m-bordered]': `_config?.display === 'bordered'`,
    '[class.m-raised]': `_config?.display === 'raised' `,
  }
})
export class MuiCardComponent implements OnChanges {
  public static ngAcceptInputType_mShowSkeleton: boolean | string;

  protected _config: MuiCardConfig;

  @Input() public mTitle?: string;
  @Input() public mDisplay: MuiCardDisplay;
  @Input() @BooleanInput() public mShowSkeleton: boolean;

  @ContentChild(MuiCardHeaderDirective) public _cardHeader: MuiCardHeaderDirective;
  @ContentChild(MuiCardContentDirective) public _cardContent: MuiCardContentDirective;
  @ContentChild(MuiCardFooterDirective) public _cardFooter: MuiCardFooterDirective;

  public constructor(
    private configService: MuiConfigService,
  ) {
    this.updateConfig();
  }

  public ngOnChanges(changes: NgChanges<MuiCardComponent>): void {
    const {mDisplay} = changes;
    if (mDisplay) {
      this.updateConfig();
    }
  }

  private updateConfig(): void {
    this._config = {
      ...DEFAULT_CARD_CONFIG,
      ...this.configService.getConfigFor('card'),
    };

    this._config.display = this.mDisplay ?? this._config.display;
  }


  /**
   * Given 2 nested m-cards: C1 and C2; where C1 is the parent of C2; and C2's template has *m-card-header directive inside and C1 has not,
   * the C1's @ContentChild queries C2's *m-card-header directive and uses it as header!
   * Injected MuiCardComponent instance allows to check the "context" of structural directive.
   */
  protected get cardHeader(): MuiCardHeaderDirective {
    return this._cardHeader?.host === this ? this._cardHeader : undefined;
  }

  protected get cardContent(): MuiCardContentDirective {
    return this._cardContent?.host === this ? this._cardContent : undefined;
  }

  protected get cardFooter(): MuiCardFooterDirective {
    return this._cardFooter?.host === this ? this._cardFooter : undefined;
  }
}
