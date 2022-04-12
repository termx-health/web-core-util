import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';

export function validateForm(form: FormGroup | FormArray | NgForm): boolean {
  if (form && !form.valid) {
    markAsDirty(form);
    return false;
  }
  return true;
}


export function markAsDirty(form: FormGroup | FormArray | NgForm): void {
  if (!form) {
    return;
  }
  if (form['form']) {
    (form as NgForm).form.markAsDirty();
  }
  if (form['markAsDirty']) {
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

export function markAsPristine(form: FormGroup | FormArray | NgForm): void {
  if (!form) {
    return;
  }
  if (form['form']) {
    (form as NgForm).form.markAsPristine();
  }
  if (form['markAsPristine']) {
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


export function toggleControls(formBuilder: FormBuilder, form: FormGroup, enabled: boolean, controls: {[key: string]: AbstractControl}): void {
  if (enabled) {
    Object.keys(controls).forEach(k => {
      const control = formBuilder.control(controls[k][0], controls[k][1]);
      form.addControl(k, control);
    });
  } else {
    Object.keys(controls).forEach(k => form.removeControl(k));
  }
}

export function toggleRequired(control: AbstractControl, required: boolean): void {
  if (!control) {
    return;
  }
  if (required) {
    control.setValidators(Validators.required);
    control['required'] = true;
  } else {
    control.clearValidators();
    control['required'] = false;
  }
  control.updateValueAndValidity();
}

export function toggleDisable(control: AbstractControl, disabled: boolean): void {
  if (control) {
    return;
  }

  if (disabled) {
    control.disable();
  } else {
    control.enable();
  }
}



