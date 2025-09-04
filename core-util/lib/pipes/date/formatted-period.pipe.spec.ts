import {FormattedPeriodPipe} from './formatted-period.pipe';
import {waitForAsync} from '@angular/core/testing';
import {EventEmitter} from '@angular/core';
import {subDays} from 'date-fns';

describe('FormattedPeriodPipe', () => {

  const translateService: any = {
    instant(key: string | Array<string>): string {
      const t: any = {};
      t['core.period.years'] = 'y';
      t['core.period.months'] = 'm';
      t['core.period.days'] = 'd';
      t['core.period.hours'] = 'h';
      return t[<string>key];
    },
    localeChange: new EventEmitter(),
    translationChange: new EventEmitter()
  };


  const pipe = new FormattedPeriodPipe(translateService);
  it('should format period', waitForAsync(() => {
    expect(pipe.transform(undefined)).toEqual('');
    expect(pipe.transform(subDays(new Date(), 1))).toEqual('1d');
    expect(pipe.transform({
        lower: new Date('2010-01-01T00:00'),
        upper: new Date('2010-01-02T01:00')
      }
    )).toEqual('1d');
    expect(pipe.transform({
      lower: new Date('2010-01-01T00:00'),
      upper: new Date('2011-02-02T01:00')
    })).toEqual('1y 1m 1d');
    expect(pipe.transform({
        lower: new Date('2010-01-01T00:00'),
        upper: new Date('2011-02-01T01:00')
      }
    )).toEqual('1y 1m 0d');
    expect(pipe.transform({
      lower: new Date('2010-01-01T00:00'),
      upper: new Date('2011-02-01T01:00')
    }, {precision: 'hour'})).toEqual('1y 1m 0d 1h');
    expect(pipe.transform({
      lower: new Date('2010-01-01T00:00'),
      upper: new Date('2010-01-02T01:00')
    }, {precision: 'hour'})).toEqual('1d 1h');
    expect(pipe.transform({
      lower: new Date('2010-01-01T00:00'),
      upper: new Date('2010-01-02T01:00')
    }, {precision: 'hour', minPrecision: 'day'})).toEqual('1d 1h');
    expect(pipe.transform({
      lower: new Date('2010-01-01T00:00'),
      upper: new Date('2010-01-01T01:00')
    }, {precision: 'hour', minPrecision: 'day'})).toEqual('0d 1h');
  }));
});
