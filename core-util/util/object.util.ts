export function filterEmptyValues(object: object): object {
  const keys = {};
  Object.entries(object).forEach(e => {
    if (e[1] !== undefined && e[1] !== null) {
      keys[e[0]] = e[1];
    }
  });
  return keys;
}

export function copyObject(obj: any): any {
  if (obj === undefined) {
    return null;
  }
  return JSON.parse(JSON.stringify(obj));
}

export function toMap<T>(array: T[], keyMapper: (T) => string): {[key: string]: T} {
  const map = {};
  array.forEach(a => map[keyMapper(a)] = a);
  return map;
}

export function toNumberMap<T>(array: T[], keyMapper: (T) => number): {[key: number]: T} {
  const map = {};
  array.forEach(a => map[keyMapper(a)] = a);
  return map;
}
