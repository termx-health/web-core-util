import _ from 'lodash';


export function isObject<T>(value: T): boolean {
  return (value && typeof value === 'object' && !Array.isArray(value));
}

export function isDefined<T>(value: T): boolean {
  return !isNil(value);
}

export function isNil<T>(value: T): boolean {
  return typeof value === 'undefined' || value === null;
}


export function equalsDeep<T>(o1: T, o2: T): boolean {
  return _.isEqual(o1, o2);
}

export function cloneDeep<T>(obj: T): T {
  return _.cloneDeep(obj);
}

export function mergeDeep<T>(target: T, source: T): T {
  return _.merge(target, source);
}

export function omit<T>(obj: T, omitBy = (value): boolean => isNil(value)): T {
  const copy = cloneDeep(obj);
  Object.keys(obj).filter((key) => omitBy(copy[key])).forEach(key => delete copy[key]);
  return copy;
}


export function getPathValue<T>(o: T, path: string): any {
  if (isDefined(o)) {
    return path?.split('.').reduce((obj, t) => obj?.[t], o);
  }
}
