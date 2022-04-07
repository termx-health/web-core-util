import moment from 'moment/moment';
import {Interval} from '../model';

export type PersonAge = Pick<Interval, "years" | "months" | "days">

export function calculateAge(start: Date, end = new Date()): PersonAge | undefined {
  if (!start) {
    return undefined;
  }
  if (end > new Date()) {
    end = new Date();
  }

  const age: PersonAge = {};
  age.years = moment(end).diff(start, 'years');
  if (age.years > 0) {
    return age;
  }
  age.months = moment(end).diff(start, 'months');
  if (age.months > 0) {
    return age;
  }
  age.days = moment(end).diff(start, 'days');
  return age;
}
