export function join<T>(array: Array<T>, separator = ','): string {
  if (!array || array.length === 0) {
    return undefined;
  }
  return array.join(separator);
}


export function equalsIgnoreCase(s1: string, s2: string): boolean {
  const s1null = (s1 === null || s1 === undefined);
  const s2null = (s2 === null || s2 === undefined);
  if (s1null || s2null) {
    return s1null === s2null;
  }
  return s1.toUpperCase() === s2.toUpperCase();
}

export function trimToNull(s: string): string | null {
  return s ? s : null;
}
