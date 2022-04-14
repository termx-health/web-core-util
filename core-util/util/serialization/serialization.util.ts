import moment from 'moment/moment';
import {DateRange, Range} from '../../model';
import {format} from '../date/date.util';


export function serializeDate(date: Date): string {
  return date ? format(date,'yyyy-MM-ddTHH:mm:ss') : undefined;
}

export function serializeDateRange(range: DateRange): Range<string> {
  if (!range) {
    return null;
  }
  return {
    lower: serializeDate(range.lower),
    upper: serializeDate(range.upper)
  };
}
