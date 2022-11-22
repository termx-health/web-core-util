import {AbstractControl, FormArray, FormBuilder, FormControl, FormControlOptions, FormGroup, NgForm, ValidatorFn, Validators} from '@angular/forms';
import {isDefined, isNil} from '../object/object.util';

export function validateForm(form?: FormGroup | FormArray | NgForm): boolean {
  if (form?.invalid) {
    markAsDirty(form);
    return false;
  }
  return true;
}

export function markAsDirty(form?: FormGroup | FormArray | NgForm): void {
  if (isNil(form)) {
    return;
  }
  if (form instanceof NgForm) {
    form.form?.markAsDirty();
  }
  if (form instanceof FormGroup || form instanceof FormArray) {
    form.markAsDirty();
  }

  Object.values(form.controls).forEach((c: any) => {
    if (c instanceof FormControl) {
      c.markAsDirty();
      c.updateValueAndValidity({emitEvent: false});
    }
    if (c instanceof FormArray || c instanceof FormGroup) {
      markAsDirty(c as FormGroup | FormArray);
    }
  });
}

export function markAsPristine(form?: FormGroup | FormArray | NgForm): void {
  if (isNil(form)) {
    return;
  }
  if (form instanceof NgForm) {
    form.form?.markAsPristine();
  }
  if (form instanceof FormGroup || form instanceof FormArray) {
    form.markAsPristine();
  }

  Object.values(form.controls).forEach((c: AbstractControl) => {
    if (c instanceof FormControl) {
      c.markAsPristine();
      c.updateValueAndValidity({emitEvent: false});
    }
    if (c instanceof FormArray || c instanceof FormGroup) {
      markAsPristine(c as FormGroup | FormArray);
    }
  });
}

export function toggleControls(
  fb: FormBuilder,
  form: FormGroup, enabled: boolean,
  controls: {[key: string]: [state: any, validators: ValidatorFn | ValidatorFn[] | FormControlOptions | null]}
): void {
  if (enabled) {
    Object.entries(controls).forEach(([k, [state, validators]]) => {
      form.addControl(k, fb.control(state, validators));
    });
  } else {
    Object.keys(controls).forEach(k => form.removeControl(k));
  }
}

export function toggleRequired(control: AbstractControl, required: boolean): void {
  if (isDefined(control)) {
    if (required) {
      control.setValidators(Validators.required);
    } else {
      control.clearValidators();
    }
    control.updateValueAndValidity();
  }
}

export function toggleDisable(control: AbstractControl, disabled: boolean): void {
  if (isDefined(control)) {
    if (disabled) {
      control.disable();
    } else {
      control.enable();
    }
  }
}



