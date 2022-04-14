export function filterFn<T>(item: T, filter: any): boolean {
  return Object.keys(filter).every(key => {
    if (!filter[key]) {
      return true;
    }
    return key.split(',').some(path => matchesPath(item, path, filter[key]));
  });
}

export function matchesPath(obj: any, path: string, needle: any): boolean {
  if (!obj) {
    return false;
  }
  if (path === '*') {
    return matchesDeep(obj, needle);
  }
  if (path.indexOf('.') >= 0) {
    const key = path.substring(0, path.indexOf('.'));
    const next = path.substring(path.indexOf('.') + 1);
    return matchesPath(obj[key], next, needle);
  }
  return matches(obj[path], needle);
}

export function matchesDeep(obj: any, needle: any): boolean {
  if (typeof obj === 'string') {
    return matches(<string>obj, needle);
  }
  return Object.values(obj).some(val => {
    if (!val) {
      return false;
    }
    return typeof val === 'object' ? matchesDeep(val, needle) : matches(<string>val, needle);
  });
}

export function matches<T>(hay: string, needle: string | number | T[]): boolean {
  if (!hay) {
    return false;
  }
  if (typeof needle === 'string') {
    return matchesValue(hay, needle);
  }
  if (typeof needle === 'number') {
    return matchesValue(hay, String(needle));
  }
  if (needle.length === 0) {
    return true;
  }
  return needle.some((n: T) => matchesValue(hay, n));
}

export function matchesValue<T>(hay: string, needle: string | number | T): boolean {
  return hay && needle === String(hay);
}
