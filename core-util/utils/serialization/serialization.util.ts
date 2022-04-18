import {DateRange, Range} from '../../models';
import {format} from '../date/date.util';
import {isDefined, isNil} from '../object/object.util';


export function serializeDate(date: Date): string {
  // Wed Jan 22 2022 04:20:00 GMT+0300 becomes '2022-01-12T04:20:00.000Z'
  return isDefined(date) ? format(date, 'yyyy-MM-ddTHH:mm:ss') : undefined;
}

export function serializeDateRange(range: DateRange): Range<string> {
  if (isNil(range)) {
    return null;
  }
  return {
    lower: serializeDate(range.lower),
    upper: serializeDate(range.upper)
  };
}
