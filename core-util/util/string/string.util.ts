import {isDefined} from '../object/object.util';

export function join<T>(array: T[], separator = ','): string {
  if (!isDefined(array) || array.length === 0) {
    return undefined;
  }
  return array.join(separator);
}

export function equalsIgnoreCase(s1: string, s2: string): boolean {
  const s1null = !isDefined(s1);
  const s2null = !isDefined(s2);
  if (s1null || s2null) {
    return s1null === s2null;
  }
  return s1.toUpperCase() === s2.toUpperCase();
}

