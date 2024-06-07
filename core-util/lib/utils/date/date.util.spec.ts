import { waitForAsync } from '@angular/core/testing';
import { format, inRange, mergeDateTime } from './date.util';

// mergeDateTime
it('merge time into date', waitForAsync(() => {
  expect(mergeDateTime(new Date(2022, 1, 10), new Date(1900, 1, 1, 13, 31)))
    .toEqual(new Date(2022, 1, 10, 13, 31));
}));

// format
it('format date', waitForAsync(() => {
  expect(format('2024-04-20', 'yyyy-MM-dd')).toEqual('2024-04-20');
  expect(format('2024-04-20', 'yyyy-MM-dd HH:mm')).toEqual('2024-04-20 00:00');
  expect(format('2024-04-20T00:00:00', 'yyyy-MM-dd HH:mm')).toEqual('2024-04-20 00:00');
  // expect(format('2024-04-20T00:00:00Z', 'yyyy-MM-dd HH:mm')).toEqual('2024-04-20 12:00');
}));

// inRange
it('check inRange when date is in range', waitForAsync(() => {
  expect(inRange({
    lower: new Date(2022, 1, 11),
    upper: new Date(2022, 1, 13)
  }, new Date(2022, 1, 12), 'days')).toBe(true);
}));

it('check inRange when date equals to lower boundary', waitForAsync(() => {
  expect(inRange({
    lower: new Date(2022, 1, 11),
    upper: new Date(2022, 1, 13)
  }, new Date(2022, 1, 11), 'days')).toBe(true);
}));

it('check inRange when date equals to upper boundary', waitForAsync(() => {
  expect(inRange({
    lower: new Date(2022, 1, 11),
    upper: new Date(2022, 1, 13)
  }, new Date(2022, 1, 13), 'days')).toBe(true);
}));

it('check inRange when date is out of range', waitForAsync(() => {
  expect(inRange({
    lower: new Date(2022, 1, 11),
    upper: new Date(2022, 1, 13)
  }, new Date(2022, 1, 14), 'days')).toBe(false);
}));

it('check inRange when date is out of range upper bound (inclusive false)', waitForAsync(() => {
  expect(inRange({
    lower: new Date(2022, 1, 11),
    upper: new Date(2022, 1, 13),
    lowerInclusive: false,
    upperInclusive: false
  }, new Date(2022, 1, 13), 'days')).toBe(false);
}));

it('check inRange when date is out of range lower bound (inclusive false)', waitForAsync(() => {
  expect(inRange({
    lower: new Date(2022, 1, 11),
    upper: new Date(2022, 1, 13),
    lowerInclusive: false,
    upperInclusive: false
  }, new Date(2022, 1, 11), 'days')).toBe(false);
}));

it('check inRange when date is in range (no lower boundary)', waitForAsync(() => {
  expect(inRange({
    lower: null,
    upper: new Date(2022, 1, 13)
  }, new Date(2022, 1, 11), 'days')).toBe(true);
}));

it('check inRange when date is out of range (no lower boundary)', waitForAsync(() => {
  expect(inRange({
    lower: null,
    upper: new Date(2022, 1, 13)
  }, new Date(2022, 1, 14), 'days')).toBe(false);
}));

it('check inRange when date is in range (no upper boundary)', waitForAsync(() => {
  expect(inRange({
    lower: new Date(2022, 1, 13),
    upper: null
  }, new Date(2022, 1, 14), 'days')).toBe(true);
}));

it('check inRange when date is out of range (no upper boundary)', waitForAsync(() => {
  expect(inRange({
    lower: new Date(2022, 1, 13),
    upper: null
  }, new Date(2022, 1, 12), 'days')).toBe(false);
}));
