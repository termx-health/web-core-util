import {AbstractControl, FormArray, FormBuilder, FormControl, FormControlOptions, FormGroup, NgForm, ValidatorFn, Validators} from '@angular/forms';
import {isNil} from '../object/object.util';

export function validateForm(form?: FormGroup | FormArray | NgForm): boolean {
  if (form && form.invalid) {
    markAsDirty(form);
    return false;
  }
  return true;
}


export function markAsDirty(form?: FormGroup | FormArray | NgForm): void {
  if (isNil(form)) {
    return;
  }
  if ((form as NgForm)['form']) {
    (form as NgForm).form.markAsDirty();
  }
  if ((form as FormGroup | FormArray)['markAsDirty']) {
    (form as FormGroup | FormArray).markAsDirty();
  }

  Object.values(form.controls).forEach((c: any) => {
    if (c instanceof FormControl) {
      c.markAsDirty();
      c.updateValueAndValidity({emitEvent: false});
    }
    if (c instanceof FormArray || c instanceof FormGroup) {
      markAsDirty(c);
    }
  });
}

export function markAsPristine(form?: FormGroup | FormArray | NgForm): void {
  if (isNil(form)) {
    return;
  }
  if ((form as NgForm)['form']) {
    (form as NgForm).form.markAsPristine();
  }
  if ((form as FormGroup | FormArray)['markAsPristine']) {
    (form as FormGroup | FormArray).markAsPristine();
  }

  Object.values(form.controls).forEach((c: AbstractControl) => {
    if (c instanceof FormControl) {
      c.markAsPristine();
      c.updateValueAndValidity({emitEvent: false});
    }
    if (c instanceof FormArray || c instanceof FormGroup) {
      markAsPristine(c);
    }
  });
}


export function toggleControls(formBuilder: FormBuilder, form: FormGroup, enabled: boolean,
  controls: {[key: string]: [state: any, validators: ValidatorFn | ValidatorFn[] | FormControlOptions | null]}): void {
  if (enabled) {
    Object.entries(controls).forEach(([k, [state, validators]]) => {
      form.addControl(k, formBuilder.control(state, validators));
    });
  } else {
    Object.keys(controls).forEach(k => form.removeControl(k));
  }
}

export function toggleRequired(control: AbstractControl, required: boolean): void {
  if (isNil(control)) {
    return;
  }
  if (required) {
    control.setValidators(Validators.required);
  } else {
    control.clearValidators();
  }
  control.updateValueAndValidity();
}

export function toggleDisable(control: AbstractControl, disabled: boolean): void {
  if (isNil(control)) {
    return;
  }
  if (disabled) {
    control.disable();
  } else {
    control.enable();
  }
}



