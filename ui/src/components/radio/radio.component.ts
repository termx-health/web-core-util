import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DestroyRef,
  Directive,
  ElementRef,
  forwardRef,
  Inject,
  Input,
  NgZone,
  OnInit,
  Optional,
  ViewChild,
  ViewEncapsulation
} from '@angular/core';
import {BooleanInput, findFocusableElement} from '@termx-health/core-util';
import {fromEvent} from 'rxjs';
import {MuiRadioService} from './radio.service';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';

@Directive({
  standalone: false,
  selector: '[m-radio-button]'
})
export class MuiRadioButtonDirective {
}


@Component({
  standalone: false,
  selector: '[m-radio], [m-radio-button]',
  template: `
    <span
        [class.m-radio]="!isRadioButton"
        [class.m-radio-checked]="isChecked && !isRadioButton"
        [class.m-radio-disabled]="isDisabled && !isRadioButton"

        [class.m-radio-button]="isRadioButton"
        [class.m-radio-button-checked]="isChecked && !isRadioButton"
        [class.m-radio-button-disabled]="isDisabled && !isRadioButton"
    >
      <input
          #inputElement
          type="radio"
          [attr.autofocus]="mAutoFocus ? 'autofocus' : null"
          [class.m-radio-input]="!isRadioButton"
          [class.m-radio-button-input]="isRadioButton"
          [disabled]="isDisabled"
          [checked]="isChecked"
      />
      <span [class.m-radio-inner]="!isRadioButton"></span>
    </span>
    <span><ng-content></ng-content></span>
  `,
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[class.m-radio-wrapper]': '!isRadioButton',
    '[class.m-radio-wrapper-checked]': 'isChecked && !isRadioButton',
    '[class.m-radio-wrapper-disabled]': 'isDisabled && !isRadioButton',

    '[class.ant-radio-button-wrapper]': 'isRadioButton',
    '[class.ant-radio-button-wrapper-checked]': 'isChecked && isRadioButton',
    '[class.ant-radio-button-wrapper-disabled]': 'isDisabled && isRadioButton',
  },
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MuiRadioComponent),
      multi: true
    }
  ]
})
export class MuiRadioComponent implements OnInit, AfterViewInit, ControlValueAccessor {
  public static ngAcceptInputType_disabled: boolean | string;
  public static ngAcceptInputType_mAutoFocus: boolean | string;

  @Input() public mValue: any;
  @Input() @BooleanInput() public mAutoFocus: boolean;
  @Input() @BooleanInput() public disabled: boolean;

  @ViewChild('inputElement') inputElement: ElementRef<HTMLInputElement>;

  protected isNgModel: boolean;
  protected isRadioButton = !!this.radioButtonDirective;
  protected isGroupDisabled: boolean;

  protected isChecked: boolean;
  public onChange: (x: any) => void;
  public onTouch: () => void;


  public constructor(
    private host: ElementRef<HTMLElement>,
    private cdr: ChangeDetectorRef,
    private ngZone: NgZone,
    private destroyRef: DestroyRef,
    @Optional() @Inject(MuiRadioService) private radioService: MuiRadioService,
    @Optional() @Inject(MuiRadioButtonDirective) private radioButtonDirective: MuiRadioButtonDirective
  ) {}


  public ngOnInit(): void {
    if (this.radioService) {
      this.radioService.disabled$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(disabled => {
        this.isGroupDisabled = disabled;
        this.cdr.markForCheck();
      });

      this.radioService.selected$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(value => {
        const isChecked = this.isChecked;
        this.isChecked = this.mValue === value;
        if (this.isNgModel && isChecked !== this.isChecked && this.isChecked === false) {
          this.onChange(false);
        }
        this.cdr.markForCheck();
      });
    }


    this.ngZone.runOutsideAngular(() => {
      fromEvent<MouseEvent>(this.host.nativeElement, 'click')
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((event) => {
          event.stopPropagation();
          event.preventDefault();

          if (this.isDisabled || this.isChecked) {
            return;
          }

          this.ngZone.run(() => {
            this.radioService?.select(this.mValue)
            if (this.isNgModel) {
              this.isChecked = true;
              this.onChange(true);
            }
            this.cdr.markForCheck();
          });
        });
    })
  }

  public ngAfterViewInit(): void {
    if (this.mAutoFocus) {
      this.focus();
    }
  }


  /* CVA */

  public writeValue(value: boolean): void {
    this.isChecked = value;
    this.cdr.markForCheck();
  }

  public registerOnChange(fn: any): void {
    this.isNgModel = true;
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouch = fn;
  }

  public setDisabledState(disabled: boolean): void {
    this.disabled = this.isGroupDisabled = disabled;
    this.cdr.markForCheck();
  }


  /* Utils */

  protected get isDisabled(): boolean {
    return this.disabled || this.isGroupDisabled;
  }

  private focus(): void {
    findFocusableElement(this.inputElement.nativeElement)?.focus()
  }
}

