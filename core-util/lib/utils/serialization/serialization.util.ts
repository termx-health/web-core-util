import {DateRange, Range} from '../../models';
import {format, from, isValid} from '../date/date.util';
import {isDefined, isNil} from '../object/object.util';


export function serializeDate(date?: Date | string): string | undefined {
  // Wed Jan 22 2022 04:20:00 GMT+0300 becomes '2022-01-12T04:20:00.000'
  return isDefined(date) && isValid(date) ? format(from(date), "yyyy-MM-dd'T'HH:mm:ss") : undefined;
}

export function serializeDateRange(range: DateRange): Range<string> | undefined {
  if (isNil(range)) {
    return undefined;
  }
  return {
    lower: serializeDate(range.lower),
    upper: serializeDate(range.upper)
  };
}
