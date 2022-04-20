import {isNil} from '../object/object.util';

export function join<T>(array: T[], separator = ','): string | undefined {
  if (isNil(array) || array.length === 0) {
    return undefined;
  }
  return array.join(separator);
}

export function equalsIgnoreCase(s1: string, s2: string): boolean {
  const s1null = isNil(s1);
  const s2null = isNil(s2);
  if (s1null || s2null) {
    return s1null === s2null;
  }
  return s1.toUpperCase() === s2.toUpperCase();
}

