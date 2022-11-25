import {isNil} from '../object/object.util';

export function unique<T>(value: T, index: number, self: T[]): boolean {
  return self.indexOf(value) === index;
}

export function uniqueBy<T>(data: T[], fn: (x: T) => unknown): T[] | undefined {
  if (isNil(data)) {
    return undefined;
  }
  return Object.values(data.reduce((uniq, val) => {
      const k = fn(val) as string;
      uniq[k] = uniq[k] || val;
      return uniq;
    }, {} as Record<string, T>)
  );
}

export function flat<T>(array: T[]): T[] {
  return [...array.flat(Infinity)] as T[];
}

export function remove<T>(array: T[], item: T): T[] {
  if (isNil(array) || isNil(item)) {
    return array;
  }
  const i = array.indexOf(item);
  if (i !== -1) {
    array.splice(i, 1);
  }
  return [...array];
}

