export function group<T>(array: T[], fn: (el: T) => string | number | symbol): {[key: string | number | symbol]: T} {
  return array.reduce((acc, el) => ({...acc, [fn(el)]: el}), {});
}

export function collect<T>(array: T[], fn: (x: T) => string | number | symbol): {[key: string | number | symbol]: T[]} {
  return array.reduce((acc, el) => {
    const key = fn(el);
    return ({...acc, [key]: [...(acc[key] || []), el]});
  }, {} as any);
}
