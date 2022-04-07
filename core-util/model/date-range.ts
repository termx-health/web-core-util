export class DateRange {
  public upper?: Date;
  public lower?: Date;

  constructor(init ?: Partial<DateRange>) {
    Object.assign(this, init);
  }

}
