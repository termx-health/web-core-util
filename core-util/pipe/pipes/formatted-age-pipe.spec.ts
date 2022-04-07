import {FormattedAgePipe} from './formatted-age-pipe';
import {async} from '@angular/core/testing';

describe('FormattedAgePipe', () => {

  const translateService: any = {
    instant(key: string | Array<string>, interpolateParams?: Object): string | any {
      if (key === 'core.period.years') {
        return 'y';
      }
      if (key === 'core.period.months') {
        return 'm';
      }
      if (key === 'core.period.days') {
        return 'd';
      }
    }
  };
  const pipe = new FormattedAgePipe(translateService);
  it('should format age', async(() => {

    expect(pipe.transform(null)).toEqual('');
    expect(pipe.transform(new Date(1984, 5), new Date(2019, 6))).toEqual('35y');
    expect(pipe.transform(new Date(2017, 5), new Date(2019, 4))).toEqual('1y 11m');
    expect(pipe.transform(new Date(2019, 5, 1), new Date(2019, 7, 8))).toEqual('0y 2m 7d');
  }));
});
