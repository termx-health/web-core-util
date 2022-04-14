import {async} from '@angular/core/testing';
import {isIEqual} from './string.util';

it('check equalsIgnoreCase', async(() => {
  expect(isIEqual(null, null)).toBe(true);
  expect(isIEqual(null, undefined)).toBe(true);
  expect(isIEqual('ab', 'ab')).toBe(true);
  expect(isIEqual('Ab', 'ab')).toBe(true);
  expect(isIEqual('Aa', 'Ab')).toBe(false);
}));
