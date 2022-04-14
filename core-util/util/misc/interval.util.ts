import moment from 'moment/moment';
import {Interval} from '../../model';

export function addInterval(date: Date, interval: Interval): Date {
  if (!date) {
    return null;
  }
  if (!interval) {
    return date;
  }
  return moment(date).add(toMomentInput(interval)).toDate();
}

export function subtractInterval(date: Date, interval: Interval): Date {
  if (!date) {
    return null;
  }
  if (!interval) {
    return date;
  }
  return moment(date).subtract(toMomentInput(interval)).toDate();
}


function toMomentInput(interval: Interval): moment.MomentInputObject {
  return {
    years: interval.years,
    months: interval.months,
    days: interval.days,
    hours: interval.hours,
    minutes: interval.minutes,
    seconds: interval.seconds
  };
}
