import {AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, NgForm, Validators} from '@angular/forms';
import {ElementRef} from '@angular/core';

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
  Object.values(form.controls).forEach((c: any) => {
    if (c instanceof FormControl) {
      c.markAsPristine();
      c.updateValueAndValidity({emitEvent: false});
    }
    if (c instanceof FormArray || c instanceof FormGroup) {
      markAsPristine(c);
    }
  });
}


export function toggleControls(formBuilder: FormBuilder, form: FormGroup, enabled: boolean, controls: {[key: string]: any}): void {
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

export function disableInput(form: FormGroup, disabled: boolean, controlName: string): void {
  if (!form || !form.get(controlName)) {
    return;
  }

  if (disabled) {
    form.get(controlName).disable();
  } else {
    form.get(controlName).enable();
  }
}


export function querySelectorAll(selector: string, elementRef: ElementRef): any[] {
  return Array.prototype.slice.call(elementRef.nativeElement.querySelectorAll(selector));
}

export function findFocusableInput(inputName: string, elementRef: ElementRef): any {
  const nodes = querySelectorAll(`[name=${inputName}]`, elementRef);
  return findFocusableElement(nodes[0]);
}

export function findFocusableElement(el: any): any {
  if (!el) {
    return null;
  }
  if (el.tabIndex !== -1) {
    return el;
  }
  for (const child of (el.children || [])) {
    const s = findFocusableElement(child);
    if (!!s) {
      return s;
    }
  }
}

export function focusNext(rootElement: any = document): any {
  const elements = [...(rootElement.querySelectorAll('input,select') as any)].filter(a => a.tabIndex !== -1);
  const idx = elements.indexOf(document.activeElement);
  if (idx === -1 || !elements[idx + 1]) {
    return;
  }
  elements[idx + 1].focus();
}

