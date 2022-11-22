import cloneDeep from 'lodash.clonedeep';
import isEqual from 'lodash.isequal';
import merge from 'lodash.merge';
import unset from 'lodash.unset';

export type RecursiveKeyOf<TObj> = {
  [TKey in keyof TObj & (string | number)]:
  TObj[TKey] extends any[] ? `${TKey}` :
    TObj[TKey] extends object
      ? `${TKey}` | `${TKey}.${RecursiveKeyOf<TObj[TKey]>}`
      : `${TKey}`;
}[keyof TObj & (string | number)];


export function isObject(value: any): boolean {
  return (value && typeof value === 'object' && !Array.isArray(value));
}

export function isDefined<T>(value: T): value is NonNullable<T> {
  return !isNil(value);
}

export function isNil(value: any): value is (undefined | null) {
  return typeof value === 'undefined' || value === null;
}


export function equalsDeep<T>(o1: T, o2: T): boolean {
  return isEqual(o1, o2);
}

export function copyDeep<T>(obj: T): T {
  return cloneDeep(obj);
}

export function mergeDeep<T>(target: T, source: T): T {
  return merge(target, source);
}

export function omit<T extends {[key: string]: unknown}>(obj: T, omitBy = (value: unknown): boolean => isNil(value)): T {
  const copy = copyDeep(obj);
  Object.keys(obj).filter((key) => omitBy(copy[key])).forEach(key => delete copy[key]);
  return copy;
}


export function getPathValue<T, R>(obj: T | undefined, path: string | RecursiveKeyOf<T> | undefined): R | undefined {
  if (isDefined(obj) && isDefined(path)) {
    return path.split('.').reduce((obj: any, t) => obj?.[t], obj) as R;
  }
}

export function pathDelete<T>(o: T, path: string): void {
  unset(o, path);
}
