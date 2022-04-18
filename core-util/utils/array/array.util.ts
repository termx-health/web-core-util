import {isNil} from '../object/object.util';

export function unique<T>(value: T, index, self: T[]): boolean {
  return self.indexOf(value) === index;
}

export function uniqueBy<T>(data: T[], fn: (x: T) => any): T[] {
  if (isNil(data)) {
    return undefined;
  }
  return Object.values(data.reduce((uniq, val) => {
      const k = fn(val);
      uniq[k] = uniq[k] || val;
      return uniq;
    }, {})
  );
}

export function flat<T>(array: T[]): T[] {
  // return array.reduce((a, b) => a.concat(b), []);
  return [...array.flat(Infinity)] as T[];
}

export function remove<T>(array: T[], item: T): void {
  if (isNil(array) || isNil(item)) {
    return undefined;
  }
  const i = array.indexOf(item);
  if (i !== -1) {
    array.splice(i, 1);
  }
}
