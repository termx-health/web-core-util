import {waitForAsync} from '@angular/core/testing';
import {equalsIgnoreCase} from './string.util';

it('check equalsIgnoreCase', waitForAsync(() => {
  expect(equalsIgnoreCase(null, null)).toBe(true);
  expect(equalsIgnoreCase(null, undefined)).toBe(true);
  expect(equalsIgnoreCase('ab', 'ab')).toBe(true);
  expect(equalsIgnoreCase('Ab', 'ab')).toBe(true);
  expect(equalsIgnoreCase('Aa', 'Ab')).toBe(false);
}));
