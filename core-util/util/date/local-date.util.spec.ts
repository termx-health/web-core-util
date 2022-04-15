import {waitForAsync} from '@angular/core/testing';
import {registerLocaleData} from '@angular/common';
import et from '@angular/common/locales/et';
import {getDateFormat, getTimeFormat} from './local-date.util';

describe('LocalDateUtil', () => {
  it('should return "dd.MM.yyyy" for "et" locale', waitForAsync(() => {
    registerLocaleData(et);
    expect(getDateFormat('et')).toEqual('dd.MM.yyyy');
  }));

  it('should return "HH:mm" for "et" locale', waitForAsync(() => {
    registerLocaleData(et);
    expect(getTimeFormat('et')).toEqual('HH:mm');
  }));
});
