import moment from 'moment/moment';

export interface PersonAge {
  years?: number;
  months?: number;
  days?: number;
}


export function calculateAge(start: Date, end = new Date()): PersonAge {
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
