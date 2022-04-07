export class NumberRange {
  public upper?: number;
  public lower?: number;

  constructor(init ?: Partial<NumberRange>) {
    Object.assign(this, init);
  }

}
