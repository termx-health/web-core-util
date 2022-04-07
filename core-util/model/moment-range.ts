import moment from 'moment/moment';

export class MomentRange {

  upper?: moment.Moment;
  lower?: moment.Moment;
  lowerInclusive?: boolean;
  upperInclusive?: boolean;

  constructor(json: any) {
    this.upper = moment(json.upper);
    this.lower = moment(json.lower);
    this.lowerInclusive = !!json.lowerInclusive;
    this.upperInclusive = !!json.upperInclusive;
  }
}
