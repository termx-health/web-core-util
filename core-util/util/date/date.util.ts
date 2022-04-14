import moment from 'moment/moment';
import {unitOfTime} from 'moment';
import {DateRange} from '../../model';
import {formatDate} from '@angular/common';
import {LIB_CONTEXT} from '../../core-util.context';
import {isDefined} from '../object/object.util';

export type DateUtilUnit = unitOfTime.DurationConstructor;

export function fromString(date: string): Date {
  return moment(date).toDate();
}

export function now(unit?: DateUtilUnit): Date {
  return unit ? startOf(new Date(), unit) : new Date();
}

/**
 * Formats a date according to locale rules.
 * Use Angular format rules! // https://angular.io/api/common/DatePipe#custom-format-options
 */
export function format(date: Date | string | number, format: string, locale = LIB_CONTEXT.locale, timezone?: string): string {
  return formatDate(date, format, locale, timezone);
}

export function isBefore(d1: Date, d2: Date, orEqual = false): boolean {
  return orEqual ? moment(d1).isSameOrBefore(moment(d2)) : moment(d1).isBefore(moment(d2));
}

export function isAfter(d1: Date, d2: Date, orEqual = false): boolean {
  return orEqual ? moment(d1).isSameOrAfter(moment(d2)) : moment(d1).isAfter(moment(d2));
}

export function add(date: Date, amount: number, unit: DateUtilUnit): Date {
  return moment(date).add(amount, unit).toDate();
}

export function subtract(date: Date, amount: number, unit: DateUtilUnit): Date {
  return moment(date).subtract(amount, unit).toDate();
}

export function startOf(date: Date, unit: DateUtilUnit): Date {
  return moment(date).startOf(unit).toDate();
}

export function endOf(date: Date, unit: DateUtilUnit): Date {
  return moment(date).endOf(unit).toDate();
}

export function inRange(range: DateRange, date: Date, unit: DateUtilUnit = 'day'): boolean {
  if (!isDefined(range)) {
    return true;
  }
  const _range = new DateRange(range);
  const _rangeLower = _range.lower ? startOf(_range.lower, unit) : null;
  const _rangeUpper = _range.upper ? startOf(_range.upper, unit) : null;
  const _date = date ? startOf(date, unit) : null;

  const valid = {lower: true, upper: true};
  if (_rangeLower) {
    valid.lower = _range.lowerInclusive ? _rangeLower <= _date : _rangeLower < _date;
  }
  if (_rangeUpper) {
    valid.upper = _range.upperInclusive ? _date <= _rangeUpper : _date < _rangeUpper;
  }

  return Object.values(valid).every(Boolean);
}


export function previous(unit: DateUtilUnit, amount = 1): DateRange {
  const prev = add(new Date(), -1 * amount, unit);
  return new DateRange({
    lower: startOf(prev, unit),
    upper: endOf(prev, unit)
  });
}

export function next(unit: DateUtilUnit, amount = 1): DateRange {
  const prev = add(new Date(), amount, unit);
  return new DateRange({
    lower: startOf(prev, unit),
    upper: endOf(prev, unit)
  });
}


export function mergeDateTime(date: Date, time: Date): Date {
  if (!isDefined(date)) {
    return null;
  }
  const d = moment(date);
  const t = moment(time);
  d.set('hour', t.get('hour'));
  d.set('minute', t.get('minute'));
  d.set('second', t.get('second'));
  d.set('millisecond', 0);
  return d.toDate();
}




