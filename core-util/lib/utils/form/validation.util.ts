import {AbstractControl, FormGroup, ValidatorFn} from '@angular/forms';
import {DateRange} from 'core-util/lib/models/range/date-range';
import {DateUtilUnit, isAfter, isBefore} from '../date/date.util';
import {isValid} from 'date-fns';

export function periodValidator(lowerRequired = true, upperRequired = true): ValidatorFn {
  return (c: AbstractControl) => {
    const period = c.value as DateRange;
    if (lowerRequired && !(period && period.lower)) {
      return {periodLowerRequired: true};
    }
    if (upperRequired && !(period && period.upper)) {
      return {periodUpperRequired: true};
    }
    return null;
  };
}

export function dateRangeValidator(fromFieldName: string = 'validFrom', toFieldName: string = 'validTo'): ValidatorFn {
  return (c: AbstractControl) => {
    const mFrom = new Date(c.get(fromFieldName)?.value);
    const mTo = new Date(c.get(toFieldName)?.value);
    return !(isValid(mFrom) && isValid(mTo)) || isBefore(mFrom, mTo) ? null : {invalid: true};
  };
}


export function validFromValidator(form: FormGroup, fieldName: string, granularity = 'minute'): ValidatorFn {
  return (c: AbstractControl) => {
    if (form && form.controls[fieldName].value) {
      if (isAfter(c.value, form.controls[fieldName].value, granularity as DateUtilUnit)) {
        return {invalid: true};
      }
      form.controls[fieldName].setErrors(null);
    }
    return null;
  };
}


export function validToValidator(form: FormGroup, fieldName: string, granularity = 'minute'): ValidatorFn {
  return (c: AbstractControl) => {
    if (form && c.value) {
      if (isBefore(c.value, form.controls[fieldName].value, granularity as DateUtilUnit)) {
        return {invalid: true};
      }
      setTimeout(() => form.controls[fieldName].setErrors(null));
    }
    return null;
  };
}


export function pathValidator(path: Array<string | number> | string, validator: ValidatorFn): ValidatorFn {
  return (c: AbstractControl) => validator(c.get(path) as AbstractControl);
}

export function conditionalValidator(condition: ((value: any) => boolean), validator: ValidatorFn): ValidatorFn {
  return (c: AbstractControl) => (condition(c.value) ? validator(c) : null);
}

