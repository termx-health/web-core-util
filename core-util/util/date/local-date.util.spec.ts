import {async, waitForAsync} from '@angular/core/testing';
import {registerLocaleData} from '@angular/common';
import et from '@angular/common/locales/et';
import en from '@angular/common/locales/en';
import {getDateFormat, getMonthFormat, getTimeFormat} from './local-date.util';

describe('LocalDateUtil', () => {
  it('should return "dd.MM.yyyy" for "et" locale', waitForAsync(() => {
    registerLocaleData(et);
    expect(getDateFormat('et')).toEqual('dd.MM.yyyy');
  }));

  it('should return "HH:mm" for "et" locale', waitForAsync(() => {
    registerLocaleData(et);
    expect(getTimeFormat('et')).toEqual('HH:mm');
  }));

  it('should return month format without day for "et" locale', waitForAsync(() => {
    registerLocaleData(et);
    expect(getMonthFormat('et')).toEqual('MM.yyyy');
  }));

  it('should return month format without day for "en" locale', waitForAsync(() => {
    registerLocaleData(en);
    expect(getMonthFormat('en')).toEqual('M/yyyy');
  }));
});
