import {DateRange} from 'core-util/model/range/date-range';
import moment, {Moment} from 'moment/moment';
import {MomentRange} from '../model';

export function mergeDateTime(date: Date, time: Date): Date {
  if (!date) {
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

export function roundDate(date: Date | string, precision: string): string {
  const dateFormats = {
    'year': 'YYYY',
    'month': 'MM.YYYY',
    'day': 'DD.MM.YYYY',
    'hour': 'DD.MM.YYYY hh',
    'minute': 'DD.MM.YYYY hh.mm',
    'second': 'DD.MM.YYYY hh.mm.ss'
  };
  return moment(date).format(dateFormats[precision]);
}

export function now(precision?: string): Date {
  return precision ? moment().startOf(precision as any).toDate() : new Date();
}

export function previousMonth(): MomentRange {
  const nowMoment: Moment = moment();
  const prevMonth = nowMoment.add(-1, 'month');
  return new MomentRange({
    lower: prevMonth.clone().startOf('month'),
    upper: prevMonth.clone().endOf('month')
  });
}

export function inRange(range: DateRange, date: Date): boolean {
  if (!range) {
    return true;
  }
  return (range.lower ? moment(range.lower).startOf('day') <= moment(date).startOf('day') : true) &&
    (range.upper ? moment(range.upper).startOf('day') >= moment(date).startOf('day') : true);
}

export function serializeLocalDate(date: Date): any {
  return date && <any> moment(date).format('YYYY-MM-DDTHH:mm:ss');
}

export function serializeLocalDateRange(range: DateRange): DateRange {
  if (!range) {
    return range;
  }
  range.lower = serializeLocalDate(range.lower);
  range.upper = serializeLocalDate(range.upper);
  return range;
}



