import moment from 'moment/moment';
import {Interval} from '../model';

export function addInterval(date: Date, interval: Interval): Date {
  if (!date) {
    return null;
  }
  if (!interval) {
    return date;
  }
  return moment(date).add(interval).toDate(); //XXX expand interval object to moment fields
}

export function subtractInterval(date: Date, interval: Interval): Date {
  if (!date) {
    return null;
  }
  if (!interval) {
    return date;
  }
  return moment(date).subtract(interval).toDate(); //XXX expand interval object to moment fields
}

