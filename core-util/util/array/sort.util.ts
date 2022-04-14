import {getPathValue} from '../object/object.util';
import {LIB_CONTEXT} from '../../core-util.context';

export function sort<T>(array: Array<T>, key: string, ascending: boolean = true): Array<T> {
  if (!key) {
    return array;
  }

  const sortParams = key.replace(' ', '').split(',');
  return array.sort((a, b): number => {
    for (let sortParam of sortParams) {
      let tempAscending = ascending;
      if (sortParam.startsWith('-')) {
        tempAscending = false;
        sortParam = sortParam.substring(1);
      }
      const result = compareValues(getPathValue(a, sortParam), getPathValue(b, sortParam), tempAscending);
      if (result && result !== 0) {
        return result;
      }
    }
    return 0;
  });
}

export function compareValues(val1: any, val2: any, ascending: boolean = true): number {
  if (typeof val1 === 'string' && typeof val2 === 'string') {
    return compareStrings(val1, val2, ascending);
  }
  if (typeof val1 === 'number' && typeof val2 === 'number') {
    return compareNumbers(val1, val2, ascending);
  }
  if (val1 instanceof Date && val2 instanceof Date) {
    return compareDates(val1, val2, ascending);
  }
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
