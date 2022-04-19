import {isNil} from '../object/object.util';

export function prettyJson(value: string | object): string | undefined {
  if (isNil(value)) {
    return undefined;
  }
  const obj = typeof value === 'string' ? JSON.parse(value) : value;
  try {
    return JSON.stringify(obj, null, 2);
  } catch (e) {
    return value.toString();
  }
}
