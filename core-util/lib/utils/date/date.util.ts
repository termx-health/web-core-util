import {DateRange} from '../../models';
import {formatDate} from '@angular/common';
import {LIB_CONTEXT} from '../../core-util.context';
import {isDefined, isNil} from '../object/object.util';
import {
  add as _add,
  differenceInDays,
  differenceInHours,
  differenceInMilliseconds,
  differenceInMinutes,
  differenceInMonths,
  differenceInSeconds,
  differenceInWeeks,
  differenceInYears,
  endOfDay,
  endOfHour,
  endOfMinute,
  endOfMonth,
  endOfSecond,
  endOfWeek,
  endOfYear,
  getHours,
  getMilliseconds,
  getMinutes,
  getSeconds,
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds,
  startOfDay,
  startOfHour,
  startOfMinute,
  startOfMonth,
  startOfSecond,
  startOfWeek,
  startOfYear,
  sub
} from 'date-fns';

export type DateUtilUnit = "years" | "months" | "weeks" | "days" | "hours" | "minutes" | "seconds" | "milliseconds";

export function from(date: string | Date): Date {
  return new Date(date);
}

export function now(unit?: DateUtilUnit): Date {
  return unit ? startOf(new Date(), unit) : new Date();
}

/**
 * Formats a date according to locale rules.
 * Use Angular format rules! // https://angular.io/api/common/DatePipe#custom-format-options
 */
export function format(date: Date | string | number | undefined, format: string, locale = LIB_CONTEXT.locale, timezone?: string): string | undefined {
  return isDefined(date) ? formatDate(date, format, locale, timezone) : undefined;
}

export function isEqual(d1: Date, d2: Date, granularity?: DateUtilUnit): boolean {
  return diff(d1, d2, granularity) === 0;
}

export function isBefore(d1: Date, d2: Date, granularity?: DateUtilUnit): boolean {
  return diff(d1, d2, granularity) < 0;
}

export function isAfter(d1: Date, d2: Date, granularity?: DateUtilUnit): boolean {
  return diff(d1, d2, granularity) > 0;
}

export function isSameOrBefore(d1: Date, d2: Date, granularity?: DateUtilUnit): boolean {
  return diff(d1, d2, granularity) <= 0;
}

export function isSameOrAfter(d1: Date, d2: Date, granularity?: DateUtilUnit): boolean {
  return diff(d1, d2, granularity) >= 0;
}

export function add(date: Date, amount: number, unit: DateUtilUnit): Date {
  return _add(date, {[unit]: amount} as Duration);
}

export function subtract(date: Date, amount: number, unit: DateUtilUnit): Date {
  return sub(date, {[unit]: amount} as Duration);
}

export function startOf(date: Date, unit: DateUtilUnit): Date {
  const funs: {[u: string]: (d: Date) => Date} = {
    seconds: startOfSecond,
    minutes: startOfMinute,
    hours: startOfHour,
    days: startOfDay,
    weeks: startOfWeek,
    months: startOfMonth,
    years: startOfYear
  };
  return funs[unit](date);
}

export function endOf(date: Date, unit: DateUtilUnit): Date {
  const funs: {[u: string]: (d: Date) => Date} = {
    seconds: endOfSecond,
    minutes: endOfMinute,
    hours: endOfHour,
    days: endOfDay,
    weeks: endOfWeek,
    months: endOfMonth,
    years: endOfYear
  };
  return funs[unit as string](date);
}

export function diff(date1: Date, date2: Date, unit: DateUtilUnit = 'milliseconds'): number {
  const funs: { [u in DateUtilUnit]: (dateLeft: Date | number, dateRight: Date | number) => number } = {
    milliseconds: differenceInMilliseconds,
    seconds: differenceInSeconds,
    minutes: differenceInMinutes,
    hours: differenceInHours,
    days: differenceInDays,
    weeks: differenceInWeeks,
    months: differenceInMonths,
    years: differenceInYears
  };
  return funs[unit](date1, date2);
}

export function inRange(range: DateRange, date: Date, unit: DateUtilUnit = 'days'): boolean {
  if (isNil(range) || isNil(date)) {
    return true;
  }
  const _range = new DateRange(range);
  const _rangeLower = _range.lower ? startOf(_range.lower, unit) : null;
  const _rangeUpper = _range.upper ? startOf(_range.upper, unit) : null;
  const _date = startOf(date, unit);

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

export function mergeDateTime(date: Date, time: Date): Date | undefined {
  if (isNil(time)) {
    return date;
  }
  if (isDefined(date)) {
    date = setHours(date, getHours(time));
    date = setMinutes(date, getMinutes(time));
    date = setSeconds(date, getSeconds(time));
    date = setMilliseconds(date, getMilliseconds(time));
    return date;
  }
}

