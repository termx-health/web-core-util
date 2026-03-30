// https://raw.githubusercontent.com/text-mask/text-mask/master/angular2/src/angular2TextMask.ts

import {Directive, ElementRef, forwardRef, Inject, Input, NgModule, OnChanges, Optional, Provider, Renderer2} from '@angular/core';
import {COMPOSITION_BUFFER_MODE, ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {ɵgetDOM as getDOM} from '@angular/platform-browser';
import {createTextMaskInputElement} from 'text-mask-core';

export class TextMaskConfig {
  mask: Array<string | RegExp> | ((raw: string) => Array<string | RegExp>) | false;
  guide?: boolean;
  placeholderChar?: string;
  pipe?: (conformedValue: string, config: TextMaskConfig) => false | string | object;
  keepCharPositions?: boolean;
  showMask?: boolean;
}

export const MASKEDINPUT_VALUE_ACCESSOR: Provider = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => MuiMaskedInputDirective),
  multi: true
};

/**
 * We must check whether the agent is Android because composition events
 * behave differently between iOS and Android.
 */
function _isAndroid(): boolean {
  const userAgent = getDOM() ? getDOM().getUserAgent() : '';
  return /android (\d+)/.test(userAgent.toLowerCase());
}

@Directive({
  standalone: false,
  host: {
    '(input)': 'handleInput($any($event.target).value)',
    '(blur)': 'onTouched()',
    '(compositionstart)': 'compositionStart()',
    '(compositionend)': 'compositionEnd($any($event.target).value)'
  },
  selector: '[mTextMask]',
  providers: [MASKEDINPUT_VALUE_ACCESSOR]
})
export class MuiMaskedInputDirective implements ControlValueAccessor, OnChanges {
  @Input('mTextMask') public textMaskConfig: TextMaskConfig = {
    mask: [],
    guide: true,
    placeholderChar: '_',
    pipe: undefined,
    keepCharPositions: false,
  };

  public onChange = (_: any) => {};
  public onTouched = () => {};

  private textMaskInputElement: any;
  private inputElement: HTMLInputElement;

  /** Whether the user is creating a composition string (IME events). */
  private _composing = false;

  constructor(
    private _renderer: Renderer2,
    private _elementRef: ElementRef,
    @Optional() @Inject(COMPOSITION_BUFFER_MODE) private readonly _compositionMode: boolean
  ) {
    if (this._compositionMode == null) {
      this._compositionMode = !_isAndroid();
    }
  }

  public ngOnChanges() {
    this.setupMask(true);
    if (this.textMaskInputElement !== undefined) {
      this.textMaskInputElement.update(this.inputElement.value);
    }
  }

  public writeValue(value: any) {
    this.setupMask();

    // set the initial value for cases where the mask is disabled
    const normalizedValue = value == null ? '' : value;
    this._renderer.setProperty(this.inputElement, 'value', normalizedValue);

    if (this.textMaskInputElement !== undefined) {
      this.textMaskInputElement.update(value);
    }
  }

  public registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }

  public registerOnTouched(fn: () => void): void { this.onTouched = fn; }

  public setDisabledState(isDisabled: boolean): void {
    this._renderer.setProperty(this._elementRef.nativeElement, 'disabled', isDisabled);
  }


  protected handleInput(value: any) {
    if (!this._compositionMode || (this._compositionMode && !this._composing)) {
      this.setupMask();

      if (this.textMaskInputElement !== undefined) {
        this.textMaskInputElement.update(value);

        // get the updated value
        value = this.inputElement.value;
        this.onChange(value);
      }
    }
  }

  private setupMask(create = false) {
    if (!this.inputElement) {
      if (this._elementRef.nativeElement.tagName.toUpperCase() === 'INPUT') {
        // `textMask` directive is used directly on an input element
        this.inputElement = this._elementRef.nativeElement;
      } else {
        // `textMask` directive is used on an abstracted input element, `md-input-container`, etc
        this.inputElement = this._elementRef.nativeElement.getElementsByTagName('INPUT')[0];
      }
    }

    if (this.inputElement && create) {
      this.textMaskInputElement = createTextMaskInputElement(
        Object.assign({inputElement: this.inputElement}, this.textMaskConfig)
      );
    }

  }

  protected compositionStart(): void { this._composing = true; }

  protected compositionEnd(value: any): void {
    this._composing = false;
    this._compositionMode && this.handleInput(value);
  }
}

@NgModule({
  declarations: [
    MuiMaskedInputDirective,
  ],
  exports: [
    MuiMaskedInputDirective
  ]
})
export class MuiTextMaskedModule {
}
