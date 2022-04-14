import {FormattedPeriodPipe} from './formatted-period-pipe';
import {async} from '@angular/core/testing';
import moment from 'moment/moment';
import {EventEmitter} from '@angular/core';
import {Observable, of} from 'rxjs';

describe('FormattedPeriodPipe', () => {

  const translateService: any = {
    get(key: string | Array<string>, params?: Object): Observable<string> {
      const t: any = {};
      t['core.period.years'] = 'y';
      t['core.period.months'] = 'm';
      t['core.period.days'] = 'd';
      t['core.period.hours'] = 'h';
      return of(t[<string>key]);
    },
    localeChange: new EventEmitter(),
    translationChange: new EventEmitter()
  };


  const pipe = new FormattedPeriodPipe(null, translateService);
  it('should format period', async(() => {
    expect(pipe.transform(null)).toEqual('');
    expect(pipe.transform(moment().subtract(1, 'day').toDate())).toEqual('1d');
    expect(pipe.transform({
      lower: moment('2010-01-01T00:00').toDate(),
      upper: moment('2010-01-02T01:00').toDate()}
    )).toEqual('1d');
    expect(pipe.transform({
      lower: moment('2010-01-01T00:00').toDate(),
      upper: moment('2011-02-02T01:00').toDate()
    })).toEqual('1y 1m 1d');
    expect(pipe.transform({
      lower: moment('2010-01-01T00:00').toDate(),
      upper: moment('2011-02-01T01:00').toDate()}
    )).toEqual('1y 1m 0d');
    expect(pipe.transform({
      lower: moment('2010-01-01T00:00').toDate(),
      upper: moment('2011-02-01T01:00').toDate()
    }, {precision: 'hour'})).toEqual('1y 1m 0d 1h');
    expect(pipe.transform({
      lower: moment('2010-01-01T00:00').toDate(),
      upper: moment('2010-01-02T01:00').toDate()
    }, {precision: 'hour'})).toEqual('1d 1h');
    expect(pipe.transform({
      lower: moment('2010-01-01T00:00').toDate(),
      upper: moment('2010-01-02T01:00').toDate()
    }, {precision: 'hour', minPrecision: 'day'})).toEqual('1d 1h');
    expect(pipe.transform({
      lower: moment('2010-01-01T00:00').toDate(),
      upper: moment('2010-01-01T01:00').toDate()
    }, {precision: 'hour', minPrecision: 'day'})).toEqual('0d 1h');
  }));
});
