import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, forwardRef, Input, OnChanges, OnInit, ViewEncapsulation} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {BooleanInput} from '@termx-health/core-util';
import {MuiRadioService} from './radio.service';
import {NgChanges} from '../core';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';


@Component({
  standalone: false,
  selector: 'm-radio-group',
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <ng-content></ng-content>
  `,
  host: {
    class: 'm-radio-group',
    '[class.m-radio-group--vertical]': `mVertical`,
    '[class.ant-radio-group-large]': `mSize === 'large'`,
    '[class.ant-radio-group-small]': `mSize === 'small'`,
  },
  providers: [
    MuiRadioService,
    {provide: NG_VALUE_ACCESSOR, useExisting: forwardRef(() => MuiRadioGroupComponent), multi: true}
  ]
})
export class MuiRadioGroupComponent implements OnInit, OnChanges, ControlValueAccessor {
  public static ngAcceptInputType_mVertical: boolean | string;
  public static ngAcceptInputType_disabled: boolean | string;

  @Input() public name: string;
  @Input() public mSize: 'large' | 'default' | 'small' = 'default';
  @Input() @BooleanInput() public mVertical: boolean;
  @Input() @BooleanInput() public disabled: boolean;


  public value: any;
  public onChange: (_: any) => void = () => undefined;
  public onTouch: (_: any) => void = () => undefined;


  public constructor(
    private cdr: ChangeDetectorRef,
    private radioService: MuiRadioService,
    private destroyRef: DestroyRef
  ) {}


  public ngOnInit(): void {
    this.radioService.selected$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
      if (this.value !== value) {
        this.value = value;
        this.onChange(this.value);
      }
    });
  }

  public ngOnChanges(changes: NgChanges<MuiRadioGroupComponent>): void {
    const {disabled} = changes;
    if (disabled) {
      this.radioService.setDisabled(this.disabled);
    }
  }


  /* CVA */

  public writeValue(obj: any): void {
    this.value = obj;
    this.radioService.select(obj);
    this.cdr.markForCheck();
  }


  public registerOnChange(fn: (_: string) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: (_: string) => void): void {
    this.onTouch = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }
}
