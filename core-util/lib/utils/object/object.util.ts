import cloneDeep from 'lodash.clonedeep';
import isEqual from 'lodash.isequal';
import merge from 'lodash.merge';


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

export function omit<T extends {[key: string]: any}>(obj: T, omitBy = (value: any): boolean => isNil(value)): T {
  const copy = copyDeep(obj);
  Object.keys(obj).filter((key) => omitBy(copy[key])).forEach(key => delete copy[key]);
  return copy;
}


export function getPathValue<T>(o: T, path: string): any {
  if (isDefined(o)) {
    return path?.split('.').reduce((obj: any, t) => obj?.[t], o);
  }
}
