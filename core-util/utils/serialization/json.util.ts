import {isNil} from '../object/object.util';

export function prettyJson(value: string): string {
  if (isNil(value)) {
    return value;
  }
  const obj = typeof value === 'string' ? JSON.parse(value) : value;
  try {
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    return value;
  }
}
