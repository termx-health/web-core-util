export abstract class Range<T> {
  public lower?: T;
  public upper?: T;

  public lowerInclusive?: boolean = true;
  public upperInclusive?: boolean = true;

  public constructor(init?: Partial<Range<T>>) {
    Object.assign(this, init);
  }
}
