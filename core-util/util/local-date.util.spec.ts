import {async} from '@angular/core/testing';
import {LocalDateUtil} from './local-date.util';
import {registerLocaleData} from '@angular/common';
import et from '@angular/common/locales/et';
import en from '@angular/common/locales/en';

describe('LocalDateUtil', () => {
  it('should return "dd.MM.yyyy" for "et" locale', async(() => {
    registerLocaleData(et);
    expect(LocalDateUtil.getDateFormat('et')).toEqual('dd.MM.yyyy');
  }));

  it('should return "HH:mm" for "et" locale', async(() => {
    registerLocaleData(et);
    expect(LocalDateUtil.getTimeFormat('et')).toEqual('HH:mm');
  }));

  it('should return month format without day for "et" locale', async(() => {
    registerLocaleData(et);
    expect(LocalDateUtil.getMonthFormat('et')).toEqual('MM.yyyy');
  }));

  it('should return month format without day for "en" locale', async(() => {
    registerLocaleData(en);
    expect(LocalDateUtil.getMonthFormat('en')).toEqual('M/yyyy');
  }));

});
