import {getPathValue, isNil, RecursiveKeyOf} from '../object/object.util';
import {LIB_CONTEXT} from '../../core-util.context';

export function sort<T>(array: T[], key?: string | RecursiveKeyOf<T>, ascending: boolean = true): T[] {
  if (isNil(key)) {
    return array;
  }

  return array.sort(sortFn(key, ascending));
}

export function sortFn<T>(key?: string | RecursiveKeyOf<T>, ascending = true): (a: T, b: T) => number {
  if (isNil(key)) {
    return () => 0;
  }

  const sortParams = key.replaceAll(' ', '').split(',');

  return (a, b): number => {
    for (let param of sortParams) {
      let tempAscending = ascending;
      if (param.startsWith('-')) {
        tempAscending = false;
        param = param.substring(1);
      }
      const result = compareValues(getPathValue(a, param), getPathValue(b, param), tempAscending);
      if (result && result !== 0) {
        return result;
      }
    }
    return 0;
  };
}


export function compareValues<T>(val1: T, val2: T, ascending: boolean = true): number {
  return compareValuesFn(ascending)(val1, val2);
}

export function compareValuesFn<T>(ascending: boolean = true): (val1: T, val2: T) => number {
  return (val1, val2) => {
    if (typeof val1 === 'string' && typeof val2 === 'string') {
      return compareStrings(val1, val2, ascending);
    }
    if (typeof val1 === 'number' && typeof val2 === 'number') {
      return compareNumbers(val1, val2, ascending);
    }
    if (val1 instanceof Date && val2 instanceof Date) {
      return compareDates(val1, val2, ascending);
    }
    if (isNil(val1)) {
      return -1;
    }
    return 0;
  };
}

export function compareStrings(val1: string, val2: string, ascending: boolean = true): number {
  return (ascending ? 1 : -1) * val1.toLowerCase().localeCompare(val2.toLowerCase(), LIB_CONTEXT.locale);
}

export function compareNumbers(val1: number, val2: number, ascending: boolean = true): number {
  if (ascending) {
    if (val1 > val2) {
      return 1;
    } else if (val1 < val2) {
      return -1;
    }
  } else {
    if (val1 < val2) {
      return 1;
    } else if (val1 > val2) {
      return -1;
    }
  }
  return 0;
}

export function compareDates(val1: Date, val2: Date, ascending: boolean = true): number {
  return compareNumbers(val1.getTime(), val2.getTime(), ascending);
}
