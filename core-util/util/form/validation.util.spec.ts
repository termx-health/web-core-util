import {async} from '@angular/core/testing';
import {ipRegex} from './validation.util';

it('check ipRegex', async(() => {
  expect(ipRegex.test('1.1.1')).toBe(false);
  expect(ipRegex.test('1.1.1.')).toBe(false);
  expect(ipRegex.test('1.1.1.1')).toBe(true);
  expect(ipRegex.test('0.0.0.0')).toBe(true);
  expect(ipRegex.test('256.168.1.1')).toBe(false);
  expect(ipRegex.test('192.168.1.1')).toBe(true);
}));
