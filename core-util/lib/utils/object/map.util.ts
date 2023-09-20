export function group<K extends string | number | symbol, V, R = V>(
  array: V[],
  groupBy: (val: V) => K,
  transform: (val: V, key?: K) => R = (val): R => val as unknown as R
): Record<K, R> {
  return array.reduce((acc, val) => {
    const k = groupBy(val);
    return ({...acc, [k]: transform(val, k)});
  }, {}) as Record<K, R>;
}


export function collect<K extends string | number | symbol, V, R = V>(
  array: V[],
  collectBy: (val: V) => K,
  transform: (val: V, key?: K) => R = (val): R => val as unknown as R
): Record<K, R[]> {
  const _acc = {} as Record<K, R[]>;

  return array.reduce((acc, val) => {
    const k = collectBy(val);
    const v = transform(val, k);
    return ({...acc, [k]: [...(acc[k] || []), v]});
  }, _acc) as Record<K, R[]>;
}
