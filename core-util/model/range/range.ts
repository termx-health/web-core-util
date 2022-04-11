export abstract class Range<T> {
  public lower?: T;
  public upper?: T;

  public lowerInclusive?: boolean;
  public upperInclusive?: boolean;

  public constructor(init?: Partial<Range<T>>) {
    Object.assign(this, init);
  }
}
