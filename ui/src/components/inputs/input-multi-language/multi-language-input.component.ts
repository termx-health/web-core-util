import {Component, forwardRef, Input, OnChanges, ViewChild, ViewEncapsulation} from '@angular/core';
import {AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, NgForm, ValidationErrors, Validator} from '@angular/forms';
import {BooleanInput, copyDeep, CoreI18nService, isDefined, validateForm} from '@termx-health/core-util';
import {MuiConfigService} from '../../../config';
import {NgChanges} from '../../core';

export interface MultiLanguageInputValue {
  [key: string]: string;
}

export interface MultiLanguageInputLanguage {
  code: string;
  names?: MultiLanguageInputValue;
}

@Component({
  standalone: false,
  selector: 'm-multi-language-input',
  encapsulation: ViewEncapsulation.None,
  host: {
    class: 'm-multi-language-input',
    '[attr.name]': 'name'
  },
  templateUrl: './multi-language-input.component.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MuiMultiLanguageInputComponent),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MuiMultiLanguageInputComponent),
      multi: true
    }
  ]
})
export class MuiMultiLanguageInputComponent implements ControlValueAccessor, Validator, OnChanges {
  public static ngAcceptInputType_nullify: boolean | string;
  public static ngAcceptInputType_disabled: boolean | string;

  @Input() public name: string;
  @Input() public mLanguages: MultiLanguageInputLanguage[];
  @Input() public mRequiredLanguages: string[];
  @Input() public mInputType: string | 'input' | 'textarea' = 'input';
  @Input() public placeholder: string = 'marina.ui.inputs.multiLanguageInput.placeholder';
  @Input() @BooleanInput() public nullify: boolean = false;
  @Input() @BooleanInput() public disabled: boolean;

  public val: MultiLanguageInputValue = {};
  public onChange: (_: MultiLanguageInputValue) => void = () => undefined;
  public onTouch: (_: MultiLanguageInputValue) => void = () => undefined;

  @ViewChild('form') public form: NgForm;

  public constructor(
    private i18nService: CoreI18nService,
    private configService: MuiConfigService,
  ) { }


  public ngOnChanges(changes: NgChanges<MuiMultiLanguageInputComponent>): void {
    const {mRequiredLanguages} = changes;
    if (mRequiredLanguages) {
      this.requiredLangs?.forEach(lang => this.addLanguage(lang));
    }
  }

  public validate(control: AbstractControl): ValidationErrors {
    const validator = control.validator?.({} as AbstractControl);
    if (validator?.['required'] && !validateForm(this.form)) {
      return {required: true};
    }
  }


  public writeValue(obj?: MultiLanguageInputValue): void {
    this.val = {...obj};
    this.requiredLangs?.forEach(lang => this.addLanguage(lang, this.val[lang]));
  }

  public fireOnChange(): void {
    const val = copyDeep(this.val);
    if (this.nullify) {
      Object.getOwnPropertyNames(val).filter(k => !val[k]?.length).forEach(k => delete val[k]);
    }

    if (Object.getOwnPropertyNames(val).length !== 0) {
      this.onChange(val);
    } else {
      this.onChange(null);
    }
  }

  public registerOnChange(fn: (_: MultiLanguageInputValue) => void): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: (_: MultiLanguageInputValue) => void): void {
    this.onTouch = fn;
  }

  public setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  public addLanguage(lang: string, value?: string): void {
    this.val[lang] = value || "";
    this.val = {...this.val};
    this.fireOnChange();
  }

  public removeLanguage(lang: string): void {
    delete this.val[lang];
    this.val = {...this.val};
    this.fireOnChange();
  }


  public requiredFirst = (langs: string[], requiredLangs: string[]): string[] => {
    return langs.sort(a => requiredLangs?.includes(a) ? -1 : 1);
  };

  public isRequired = (lang: string, requiredLangs: string[]): boolean => {
    return isDefined(requiredLangs) && requiredLangs.includes(lang);
  };

  public isFree = (lang: MultiLanguageInputLanguage, val: MultiLanguageInputValue): boolean => {
    return isDefined(val) && !(lang.code in val);
  };

  public langName = (lang: string, langs: MultiLanguageInputLanguage[], locale: string): string => {
    return langs?.find(l => l.code === lang)?.names?.[locale] || lang;
  };


  public get currentLang(): string {
    return this.i18nService?.currentLang;
  }

  public get langs(): MultiLanguageInputLanguage[] {
    return this.mLanguages || this.configService.getConfigFor('multiLanguageInput')?.languages;
  }

  public get requiredLangs(): string[] {
    return this.mRequiredLanguages || this.configService.getConfigFor('multiLanguageInput')?.requiredLanguages;
  }
}
