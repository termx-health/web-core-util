import {Component, ContentChildren, DestroyRef, forwardRef, Input, OnInit, QueryList} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {catchError, finalize, map, Observable, of, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, switchMap} from 'rxjs/operators';
import {NzOptionComponent} from 'ng-zorro-antd/select';
import {BooleanInput, isNil} from '@termx-health/core-util';
import {MuiSelectButtonComponent} from '../select/select-button.component';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Component({
  standalone: false,
  selector: 'm-search-input',
  host: {
    class: 'm-search-input-wrapper'
  },
  template: `
    <m-select
      class="m-search-input"
      icon="search"
      [(ngModel)]="value"
      (mInputChange)="onSearch($event)"
      (mChange)="fireOnChange()"
      [placeholder]="placeholder"
      [filterOption]="filterOption"
      [autoUnselect]="false"
      [loading]="loading"
      [multiple]="multiple"
      [disabled]="disabled | toBoolean"
    >
      <m-option *ngFor="let item of data | values" [mValue]="item" [mLabel]="item | apply:labelFormat"></m-option>
      <m-select-button *ngFor="let b of buttons"
        [mLabel]="b.mLabel"
        [mHotkey]="b.mHotkey"
        [mReopenOnClick]="b.mReopenOnClick"
        (mClick)="b.mClick.emit($event)"
      ></m-select-button>
    </m-select>
  `,
  providers: [{provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MuiSearchInputComponent), multi: true}]
})
export class MuiSearchInputComponent<T> implements OnInit, ControlValueAccessor {
  public static ngAcceptInputType_multiple: boolean | string;
  public static ngAcceptInputType_disabled: boolean | string;

  @Input() public loadFunction: (text: string) => Observable<T[]>;
  @Input() public labelFormat: (item: T) => string;
  @Input() public filterOption: (text: string, option: NzOptionComponent) => boolean;
  @Input() public placeholder: string = 'marina.ui.inputs.search.placeholder';
  @Input() public compareWith: string = 'id'; // todo: function
  @Input() public minInputLength: number = 2;
  @Input() @BooleanInput() public multiple: boolean;
  @Input() @BooleanInput() public disabled: boolean;

  @ContentChildren(MuiSelectButtonComponent) public buttons: QueryList<MuiSelectButtonComponent>;

  public readonly searchUpdate = new Subject<string>();
  public loading: boolean;

  public value: T | T[];
  public data: {[key: string]: T} = {};

  public onChange: (_: T | T[]) => void = () => undefined;
  public onTouched: () => void = () => undefined;

  public constructor(private destroyRef: DestroyRef) {}

  public ngOnInit(): void {
    this.searchUpdate.pipe(
      takeUntilDestroyed(this.destroyRef),
      debounceTime(250),
      distinctUntilChanged(),
      switchMap(text => this.loadData(text))
    ).subscribe(data => this.data = data);
  }


  public onSearch(text: string): void {
    this.searchUpdate.next(text);
  }

  private loadData(text: string): Observable<{[key: string]: T}> {
    if (isNil(text) || text.length < this.minInputLength) {
      return of({...this.multiple ? this.data : {}});
    }

    this.loading = true;
    return this.loadFunction(text).pipe(
      map(resp => ({...this.merge(this.data, resp)})),
      catchError(() => of({...this.data})),
      finalize(() => this.loading = false),
    );
  }


  public writeValue(obj: T | T[]): void {
    this.value = obj;
  }

  public fireOnChange(): void {
    this.onChange(this.value);
  }

  public registerOnChange(fn: (_: T | T[]) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }


  public merge = (items: {}, val: T | T[]): {} => {
    if (isNil(val)) {
      return items;
    }
    (Array.isArray(val) ? val : [val]).forEach(v => items[this.getKey(v)] = v);
    return items;
  };

  private getKey(item: T): string {
    return item[this.compareWith];
  }
}
