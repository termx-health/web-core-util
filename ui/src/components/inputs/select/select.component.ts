import {
  AfterContentInit,
  Component,
  ContentChildren,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnChanges,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {NzSelectComponent} from 'ng-zorro-antd/select';
import {BooleanInput, findFocusableElement, getPathValue} from '@termx-health/core-util';
import {MuiSelectButtonComponent} from './select-button.component';
import {MuiOptionComponent} from './option.component';
import {NzSelectItemInterface} from 'ng-zorro-antd/select';

@Component({
  standalone: false,
  selector: 'm-select',
  encapsulation: ViewEncapsulation.None,
  templateUrl: './select.component.html',
  host: {
    class: `m-select-wrapper`,
    '[attr.name]': 'name'
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MuiSelectComponent),
      multi: true
    }
  ]
})
export class MuiSelectComponent<T> implements AfterContentInit, ControlValueAccessor, OnChanges {
  public static ngAcceptInputType_loading: boolean | string;
  public static ngAcceptInputType_allowClear: boolean | string;
  public static ngAcceptInputType_small: boolean | string;
  public static ngAcceptInputType_multiple: boolean | string;
  public static ngAcceptInputType_tags: boolean | string;
  public static ngAcceptInputType_disabled: boolean | string;
  public static ngAcceptInputType_required: boolean | string;

  public static ngAcceptInputType_autoSelect: boolean | string;
  public static ngAcceptInputType_autoUnselect: boolean | string;
  public static ngAcceptInputType_clearOnSelect: boolean | string;

  public readonly ABBREVIATE_LENGTH = 150;

  @Input() public name: string;
  @Input() public placeholder: string = 'marina.ui.inputs.select.placeholder';
  @Input() public icon: 'select' | 'search' = 'select';
  @Input() public maxMultipleCount?: number;
  @Input() public filterOption?: (input: string, option: NzSelectItemInterface) => boolean;
  @Input() public compareWith: string | ((o1: T, o2: T) => boolean) = (o1: T, o2: T) => o1 === o2;

  @Input() @BooleanInput() public loading: boolean;
  @Input() @BooleanInput() public allowClear: boolean = true;
  @Input() @BooleanInput() public small: boolean;
  @Input() @BooleanInput() public multiple: boolean;
  @Input() @BooleanInput() public tags: boolean;
  @Input() @BooleanInput() public disabled: boolean;
  @Input() @BooleanInput() public required: boolean;

  @Input() @BooleanInput() public autoSelect: boolean; // autoselect single possible value
  @Input() @BooleanInput() public autoUnselect: boolean = true; // unselects if value not present in options
  @Input() @BooleanInput() public clearOnSelect: boolean;

  @Output() public mChange = new EventEmitter<T | T[]>();
  @Output() public mInputChange = new EventEmitter<string>();


  private dataLoaded = false;
  public inputVal?: string;
  public val?: T | T[];
  public onChange: (_: T | T[]) => void = () => undefined;
  public onTouch: (_: T | T[]) => void = () => undefined;


  @ContentChildren(MuiOptionComponent) public options!: QueryList<MuiOptionComponent<T>>;
  @ContentChildren(MuiSelectButtonComponent) public selectButtons!: QueryList<MuiSelectButtonComponent>;
  @ViewChild('input') public input!: NzSelectComponent;


  public constructor(
    private elementRef: ElementRef
  ) {}


  public ngOnChanges(changes: SimpleChanges): void {
    // todo: NgChanges
    if (changes['autoSelect']?.currentValue && this.options) {
      this.autoselect(this.options);
    }
  }

  public ngAfterContentInit(): void {
    this.autoselect(this.options);
    // todo: startWith(this.options)
    this.options.changes.subscribe(ql => {
      this.autoselect(ql);
    });
  }

  public focus(): void {
    findFocusableElement(this.elementRef.nativeElement).focus();
  }


  /* CVA */

  public writeValue(obj: T): void {
    this.val = obj;
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }


  /* Value changes */

  public fireOnChange(val: T | T[] | string | string[]): void {
    if (Array.isArray(val) ? val.some(this.isSelectButton) : this.isSelectButton(val)) {
      const vals = Array.isArray(val) ? val : [val];
      vals.filter(this.isSelectButton).forEach(sbv => {
        const idx = Number(sbv.replace('m-select-button-', ''));
        const bc = this.selectButtons.toArray()[idx];
        bc.mClick.emit(this.inputVal);
        this.input.writeValue(this.val);
        if (bc.mReopenOnClick) {
          window.setTimeout(() => this.input.setOpenState(true));
        }
      });
      return;
    }

    this.val = val as T | T[];
    this.onChange(this.val);
    this.mChange.emit(this.val);
    if (this.clearOnSelect) {
      window.setTimeout(() => this.val = null);
    }

    if (this.val && !this.multiple && !this.autoSelect) {
      // should not work when autoselecting.
      this.input.focus(); // just to keep focus in input when picking using mouseclick
    }
  }


  public inputValueChange = (input: string): void => {
    this.mInputChange.emit(input);
    window.setTimeout(() => {
      this.inputVal = input;
    }, 100);
  };


  /* Auto select */

  private autoselect(ql: QueryList<MuiOptionComponent<T>>): void {
    const currentVals = Array.isArray(this.val) ? this.val : [this.val];
    const compareFn = this.getCompareWith(this.compareWith);
    const containsVal = (vals: T[], el: T): boolean => vals.some(v => compareFn(v, el));

    // fixme: a bit sketchy to check internal variable. possible without it? also WTF
    if (ql['_results'] && ql['_results'].length > 0) {
      this.dataLoaded = true;
    }

    if (this.autoSelect && ql.length === 1 && !containsVal(currentVals, ql.first.mValue)) {
      this.selectValue(ql.first.mValue);
      return;
    }


    if (this.autoUnselect && this.dataLoaded) {
      const optionValues: T[] = ql['_results'].map((o: MuiOptionComponent<T>) => o.mValue);
      if (!this.val) {
        return;
      }

      if (Array.isArray(this.val)) {
        this.selectValue(this.val.filter(v => containsVal(optionValues, v)));
      } else {
        if (!containsVal(optionValues, this.val)) {
          this.selectValue(null);
        }
      }
    }
  }

  private selectValue(value: T | T[] | null): void {
    if (this.multiple && value && !Array.isArray(value)) {
      value = [value];
    }
    window.setTimeout(() => this.fireOnChange(value));
  }


  /* Key events */

  public onKeypress = (e: KeyboardEvent): void => {
    this.selectButtons?.filter(b => !!b.mHotkey).forEach(b => {
      const combo = b.mHotkey!.split('+');
      if (
        (!combo.includes('ctrl') || e.ctrlKey) &&
        (!combo.includes('alt') || e.altKey) &&
        (!combo.includes('shift') || e.shiftKey)
      ) {
        const key = combo.find(c => !['ctrl', 'alt', 'shift'].includes(c));
        if (e.key === key) {
          e.stopPropagation();
          e.preventDefault();

          b.mClick.emit(this.inputVal);
          this.input.setOpenState(!!b.mReopenOnClick);
        }
      }
    });
  };


  /* Utils */

  private isSelectButton = (v: T | string): v is string => {
    return typeof (v) === 'string' && v.startsWith('m-select-button');
  };

  public getCompareWith = (el: string | ((o1: T, o2: T) => boolean)): ((o1: T, o2: T) => boolean) => {
    return (o1: T, o2: T) => {
      if (this.isSelectButton(o1) && this.isSelectButton(o2)) {
        return o1 === o2;
      }

      if (typeof (el) === 'string') {
        return o1 && o2 && getPathValue(o1, el) === getPathValue(o2, el);
      }

      return el(o1, o2);
    };
  };

  public filterOptionsInner = (input: string, option: NzSelectItemInterface): boolean => {
    if (this.isSelectButton(option.nzValue)) {
      return true;
    }
    if (this.filterOption) {
      return this.filterOption(input, option);
    }
    // todo: includes; use && instead of ?
    return option.nzLabel ? String(option.nzLabel).toLowerCase().indexOf(input.toLowerCase()) >= 0 : false;
  };

  public findSuitableValue = (): void => {
    if (this.inputVal) {
      const matchingOptions = this.options.filter(o => o.mLabel!.toLowerCase().includes(this.inputVal!.toLowerCase()));
      if (matchingOptions.length === 1) {
        this.selectValue(matchingOptions[0].mValue);
      }
    }
  };
}
