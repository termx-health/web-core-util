import {Component, DestroyRef, ElementRef, EventEmitter, Inject, Input, OnInit, Optional, Output} from '@angular/core';
import {RouterLink} from '@angular/router';
import {BooleanInput} from '@termx-health/core-util';
import {Highlightable} from '@angular/cdk/a11y';
import {MuiListService} from './list.service';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  standalone: false,
  selector: 'm-list-item',
  template: `
    <ng-content></ng-content>
  `,
  host: {
    class: 'm-list-item m-bordered',
    '[class.m-list-item--selectable]': `isClickable`,
    '[class.m-list-item--selected]': `_isSelected`,
    '[class.m-list-item--active]': `_isActive`,
    '[attr.tabindex]': `-1`,
    '(click)': `onClick($event)`,
  }
})
export class MuiListItemComponent implements Highlightable, OnInit {
  public static ngAcceptInputType_mClickable: boolean | string;

  @Input() public mValue: any; // used with NgModel
  @Input() @BooleanInput() public mClickable: boolean;
  @Output() public mClick = new EventEmitter<MouseEvent>(); // when actual user clicks

  protected _isActive = false; // changed via Highlightable
  protected _isSelected = false; // changed via service

  public constructor(
    private el: ElementRef,
    private destroyRef: DestroyRef,
    @Optional() @Inject(MuiListService) private service: MuiListService,
    @Optional() private routerLink?: RouterLink,
  ) {}


  public ngOnInit(): void {
    this.service.selectedItems$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(selected => {
      this._isSelected = selected.includes(this);
    });
  }


  public emulateClick(): void {
    this.el.nativeElement.click();
  }

  protected onClick(event: MouseEvent): void {
    if (this.isClickable) {
      this.service?.onItemClick(this);
      setTimeout(() => this.mClick.emit(event));
    }
  }


  /* Highlightable */

  public setActiveStyles(): void {
    this._isActive = true;
  }

  public setInactiveStyles(): void {
    this._isActive = false;
  }

  public get disabled(): boolean {
    return !this.isClickable;
  }


  /* Utils */

  public get isClickable(): boolean {
    return !!(this.mClickable || this.routerLink);
  };
}
