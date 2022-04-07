export function join<T>(array: Array<T>, separator = ','): string | undefined {
  if (!array || array.length === 0) {
    return undefined;
  }
  return array.join(separator);
}

export function unique<T>(value: T, index, self: T[]): boolean {
  return self.indexOf(value) === index;
}

export function flat<T>(array: T[][]): T[] {
  return array.reduce((a, b) => a.concat(b), []);
}

export function remove<T>(array: T[], item: T): void {
  if (!array || !item) {
    return;
  }
  const i = array.indexOf(item);
  if (i === -1) {
    return;
  }
  array.splice(i, 1);
}

export function getUniqueBy<T>(data: T[], fn: (x: T) => any): T[] {
  if (!data) {
    return data;
  }
  return Object.values(data.reduce((uniq, val) => {
      const k = fn(val);
      uniq[k] = uniq[k] || val;
      return uniq;
    }, {})
  );
}

export function sum(arr: number[]): number {
  return arr.reduce((p, c) => p + c, 0);
}

export function groupBy<K, T>(data: T[], fn: (x: T) => K): Map<K, T[]> {
  const res = new Map<K, T[]>();
  data.forEach(t => {
    const key = fn(t);
    if (res.has(key)) {
      res.get(key)!.push(t);
    } else {
      res.set(key, [t]);
    }
  });
  return res;
}
