import {
  AfterContentInit,
  Component,
  ContentChild,
  ContentChildren,
  DestroyRef,
  Directive,
  Input,
  QueryList,
  TemplateRef,
  ViewEncapsulation
} from '@angular/core';
import {MuiDropdownItemDirective} from './dropdown-item.directive';
import {BooleanInput} from '@termx-health/core-util';
import {NzPlacementType} from 'ng-zorro-antd/dropdown';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Directive({standalone: false, selector: '[m-dropdown-container], [mDropdownContainer]'})
export class MuiDropdownContainerDirective {
  public constructor(public template: TemplateRef<any>) { }
}

@Component({
  standalone: false,
  selector: 'm-dropdown',
  encapsulation: ViewEncapsulation.None,
  template: `
    <span *ngIf="visible && lazy">
      <ng-template [ngTemplateOutlet]="dropdownButton"></ng-template>
    </span>
    <span nz-dropdown
      [nzDropdownMenu]="dropdownMenu"
      [nzPlacement]="mPlacement"
      [nzOverlayClassName]="mOverlayClassName"
      [nzOverlayStyle]="mOverlayStyle"
      *ngIf="visible && !lazy"
    >
      <ng-template [ngTemplateOutlet]="dropdownButton"></ng-template>
    </span>

    <!-- Displayed dropdown look-->
    <ng-template #dropdownButton>
      <m-icon-button *ngIf="!dropdownContainer" mIcon="ellipsis"></m-icon-button>

      <ng-container *ngIf="dropdownContainer">
        <ng-template [ngTemplateOutlet]="dropdownContainer.template"></ng-template>
      </ng-container>
    </ng-template>

    <!-- Menu -->
    <nz-dropdown-menu #dropdownMenu>
      <ul nz-menu>
        <ng-container *ngFor="let item of items">
          <li nz-menu-item *ngIf="item.mVisible" class="m-dropdown-menu-item">
            <ng-template [ngTemplateOutlet]="item.template"></ng-template>
          </li>
        </ng-container>
      </ul>
    </nz-dropdown-menu>
  `,
  host: {
    class: 'm-dropdown',
    '(mouseenter)': `this.lazy = false`,
    '(focus)': `this.lazy = false`,
  }
})
export class MuiDropdownComponent implements AfterContentInit {
  public static ngAcceptInputType_mHideIfEmpty: boolean | string;

  @Input() @BooleanInput() public mHideIfEmpty: boolean = true;
  @Input() public mOverlayClassName: string;
  @Input() public mOverlayStyle: {[key: string]: any};
  @Input() public mPlacement: NzPlacementType = 'bottomLeft';

  @ContentChild(MuiDropdownContainerDirective) public dropdownContainer: MuiDropdownContainerDirective;
  @ContentChildren(MuiDropdownItemDirective) public items: QueryList<MuiDropdownItemDirective>;

  public visible: boolean;
  public lazy: boolean = true;

  public constructor(private destroyRef: DestroyRef) { }

  public ngAfterContentInit(): void {
    if (this.mHideIfEmpty) {
      this.items.changes.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.listenForVisibilityChanges());
      this.listenForVisibilityChanges();
      this.calcDropdownVisible();
    } else {
      this.visible = true;
    }
  }


  private listenForVisibilityChanges(): void {
    this.items
      .filter(i => !i.visibleChanged.observed)
      .forEach(item => item.visibleChanged.subscribe(() => this.calcDropdownVisible()));
  }

  private calcDropdownVisible(): void {
    this.visible = this.items.map(i => i.mVisible).some(b => !!b);
  }
}
