import {AbstractControl, FormGroup, ValidatorFn} from '@angular/forms';
import {DateRange} from '../model';
import moment from 'moment/moment';
import StartOf = moment.unitOfTime.StartOf;

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

export function validFromValidator(form: FormGroup, toFieldName = 'validTo', granularity = 'minute'): ValidatorFn {
  return (c: AbstractControl) => {
    if (form && form.controls[toFieldName].value) {
      if (moment(c.value).isAfter(form.controls[toFieldName].value, granularity as StartOf)) {
        return {invalid: true};
      }
      form.controls[toFieldName].setErrors(null);
    }
  };
}

export function pathValidator(path: Array<string | number> | string, validator: ValidatorFn): ValidatorFn {
  return (c: AbstractControl) => validator(c.get(path));
}

export function conditionalValidator(condition: ((value: any) => boolean), validator: ValidatorFn): ValidatorFn {
  return (c: AbstractControl) => (condition(c.value) ? validator(c) : null);
}

export function validToValidator(form: FormGroup, fromFieldName = 'validFrom', granularity = 'minute'): ValidatorFn {
  return (c: AbstractControl) => {
    if (form && c.value) {
      if (moment(c.value).isBefore(form.controls[fromFieldName].value)) {
        return {invalid: true};
      }
      setTimeout(() => form.controls[fromFieldName].setErrors(null));
    }
  };
}

export function dateRangeValidator(fromFieldName: string = 'validFrom', toFieldName: string = 'validTo'): ValidatorFn {
  return (c: AbstractControl) => {
    const mFrom = moment(c.get(fromFieldName).value);
    const mTo = moment(c.get(toFieldName).value);
    return !(mFrom.isValid() && mTo.isValid()) || mFrom.isBefore(mTo) ? null : {invalid: true};
  };
}

export const ipRegex: RegExp = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;

