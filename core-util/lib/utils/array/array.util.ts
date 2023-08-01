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
      uniq[k] = uniq[k] ?? val;
      return uniq;
    }, {} as Record<string, T>)
  );
}

export function duplicate<T>(el: T, _idx: number, self: T[]): boolean {
  return self.indexOf(el) !== self.lastIndexOf(el);
}

export function duplicateBy<T>(data: T[], fn: (x: T) => unknown): T[] | undefined {
  if (isNil(data)) {
    return undefined;
  }
  const dups: Record<string, {cnt: number, els: T[]}> = {};
  data.forEach(val => {
    const k = fn(val) as string;
    const d = dups[k] ??= {cnt: 0, els: []};
    d.cnt++;
    d.els.push(val);
  });

  return Object.values(dups).filter(d => d.cnt > 1).map(d => d.els).flat();
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

