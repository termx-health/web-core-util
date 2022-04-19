import {isDefined, isNil} from '../object/object.util';

export type SearchNeedle = string | string [] | number | number[];
export type SearchMatchingFn = (hay: string, needle: string) => boolean;


const defaultMatchingFn = (hay: string, needle: string): boolean => isDefined(hay) && needle === hay;
const regexMatchingFn = (hay: string, needle: string): boolean => isDefined(hay) && new RegExp(needle, 'i').test(hay);

export const searchFilterFn = (item: any, filter: {[path: string]: SearchNeedle}): boolean => filterFn(item, filter, defaultMatchingFn);
export const searchFilter = (item: any, text: string): boolean => searchFilterFn(item, {'*': text});
export const textFilterFn = (item: any, filter: {[path: string]: SearchNeedle}): boolean => filterFn(item, filter, regexMatchingFn);
export const textFilter = (item: any, text: string): boolean => textFilterFn(item, {'*': text});


const filterFn = (item: object, filter: {[path: string]: SearchNeedle}, matchFn: SearchMatchingFn): boolean => {
  return Object.entries(filter).every(([key, needle]) => {
    if (isNil(needle)) {
      return true;
    }
    return key.split(',').some(path => matchesPath(item, path, needle, matchFn));
  });
};


export function matchesPath(obj: any | undefined, path: string, needle: SearchNeedle, matchFn: SearchMatchingFn = defaultMatchingFn): boolean {
  if (isNil(obj)) {
    return false;
  }
  if (path === '*') {
    return matchesDeep(obj, needle, matchFn);
  }
  if (path.indexOf('.') >= 0) {
    const [key, ...next] = path.split('.');
    return matchesPath(obj[key], next.join('.'), needle, matchFn);
  }
  return matches(obj[path], needle, matchFn);
}

function matchesDeep(obj: string | object, needle: SearchNeedle, matchFn: SearchMatchingFn): boolean {
  if (typeof obj === 'string') {
    return matches(obj, needle, matchFn);
  }
  return Object.values(obj).some(val => {
    if (isNil(val)) {
      return false;
    }
    return typeof val === 'object' ? matchesDeep(val, needle, matchFn) : matches(val, needle, matchFn);
  });
}

function matches(hay: string | number | (string | number)[], needle: SearchNeedle, matchFn: SearchMatchingFn): boolean {
  if (isNil(hay) || typeof hay === 'object') {
    return false;
  }
  const _hay = String(hay);
  if (typeof needle === 'string') {
    return matchFn(_hay, needle);
  }
  if (typeof needle === 'number') {
    return matchFn(_hay, String(needle));
  }
  if (needle.length === 0) {
    return true;
  }
  return needle.some((n: string | number) => matchFn(_hay, String(n)));
}
