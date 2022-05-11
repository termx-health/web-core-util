export function group<T>(array: T[], fn: (el: T) => string | number | symbol): {[key: string | number | symbol]: T} {
  return array.reduce((acc, el) => ({...acc, [fn(el)]: el}), {}) as Record<string | number | symbol, T>;
}

export function collect<T>(array: T[], fn: (x: T) => string | number | symbol): {[key: string | number | symbol]: T[]} {
  const _acc: Record<string | number | symbol, T[]> = {};

  return array.reduce((acc, el) => {
    const key = fn(el);
    return ({...acc, [key]: [...(acc[key] || []), el]});
  }, _acc) as Record<string | number | symbol, T[]>;
}
