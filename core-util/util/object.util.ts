export function isObject<T>(value: T): boolean {
  return (value && typeof value === 'object' && !Array.isArray(value));
}

export function isDefined<T>(value: T): boolean {
  return typeof value !== 'undefined' && value !== null;
}

export function isEqual<T>(o1: T, o2: T): boolean {
  // todo: a better equals, please
  return JSON.stringify(o1) === JSON.stringify(o2);
}

export function copyDeep<T>(obj: T): T {
  if (obj === undefined) {
    return null;
  }
  // todo: a better copyDeep, please
  return JSON.parse(JSON.stringify(obj));
}

export function mergeDeep(target: any, source: any): any {
  let output = Object.assign({}, target);
  if (isObject(target) && isObject(source)) {
    Object.keys(source).forEach((key: any) => {
      if (isObject(source[key])) {
        if (!(key in target)) {
          Object.assign(output, {[key]: source[key]});
        } else {
          output[key] = mergeDeep(target[key], source[key]);
        }
      } else {
        Object.assign(output, {[key]: source[key]});
      }
    });
  }
  return output;
}


export function getPathValue(o: any, path: string): any {
  if (o === undefined) {
    return undefined;
  }
  if (path.indexOf('.') >= 0) {
    const key = path.substring(0, path.indexOf('.'));
    const next = path.substring(path.indexOf('.') + 1);
    return getPathValue(o[key], next);
  }
  return o[path];
}


export function filterEmptyValues(object: object): object {
  const keys = {};
  Object.entries(object).forEach(e => {
    if (isDefined(e[1])) {
      keys[e[0]] = e[1];
    }
  });
  return keys;
}
