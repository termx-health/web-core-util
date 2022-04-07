import {async} from '@angular/core/testing';
import {inRange, mergeDateTime} from './date.util';

it('merge dates', async(() => {
  expect(mergeDateTime(new Date(2019, 5, 10), new Date(2019, 5, 11, 13, 31)))
    .toEqual(new Date(2019, 5, 10, 13, 31));
}));

it('check range in middle', async(() => {
  expect(inRange({
    lower: new Date(2019, 5, 11),
    upper: new Date(2019, 5, 13)
  }, new Date(2019, 5, 12))).toBe(true);
}));

it('check range is in when equals to lower boundary', async(() => {
  expect(inRange({
    lower: new Date(2019, 5, 11),
    upper: new Date(2019, 5, 13)
  }, new Date(2019, 5, 11))).toBe(true);
}));

it('check range is in when equals to upper boundary', async(() => {
  expect(inRange({
    lower: new Date(2019, 5, 11),
    upper: new Date(2019, 5, 13)
  }, new Date(2019, 5, 13))).toBe(true);
}));

it('check date is out of range', async(() => {
  expect(inRange({
    lower: new Date(2019, 5, 11),
    upper: new Date(2019, 5, 13)
  }, new Date(2019, 5, 14))).toBe(false);
}));

it('check range is in with null lower boundary', async(() => {
  expect(inRange({
    lower: null,
    upper: new Date(2019, 5, 13)
  }, new Date(2019, 5, 11))).toBe(true);
}));

it('is out of range with null lower boundary', async(() => {
  expect(inRange({
    lower: null,
    upper: new Date(2019, 5, 13)
  }, new Date(2019, 5, 14))).toBe(false);
}));

it('check range is in with null upper boundary', async(() => {
  expect(inRange({
    lower: new Date(2019, 5, 13),
    upper: null
  }, new Date(2019, 5, 14))).toBe(true);
}));

it('range is out of range with null upper boundary', async(() => {
  expect(inRange({
    lower: new Date(2019, 5, 13),
    upper: null
  }, new Date(2019, 5, 12))).toBe(false);
}));
