import {async} from '@angular/core/testing';
import {sort} from './sort.util';
import {LIB_CONTEXT} from '../../core-util.context';

describe('Sort', () => {

  const o1 = {'id': 1, 'level1': {'level2': 'Bsa'}, 'date': new Date(2018, 6, 1)};
  const o2 = {'id': 2, 'level1': {'level2': 'dsa'}, 'date': new Date(2013, 5, 1)};
  const o3 = {'id': 3, 'level1': {'level2': 'asd'}, 'date': new Date(2017, 5, 2)};
  const o4 = {'id': 4};
  const list = [o2, o3, o4, o1];

  it('should sort list', async(() => {
    expect(sort(list, 'id', false)).toEqual([o4, o3, o2, o1]);
    expect(sort(list, 'level1.level2', true)).toEqual([o4, o3, o1, o2]);
    expect(sort(list, 'id', null)).toEqual([o4, o3, o2, o1]);
    expect(sort(list, null)).toEqual([o4, o3, o2, o1]);
    expect(sort(list, null, null)).toEqual([o4, o3, o2, o1]);
    expect(sort(list, 'date', false)).toEqual([o4, o1, o3, o2]);
    expect(sort(list, 'date', true)).toEqual([o4, o2, o3, o1]);
  }));

  const a1 = {'id': 1, 'level1': {'level2': 'Bsa'}, 'date': new Date(2018, 6, 1)};
  const a2 = {'id': 2, 'level1': {'level2': 'dsa'}, 'date': new Date(2013, 5, 1)};
  const a3 = {'id': 3, 'level1': {'level2': 'asd'}, 'date': new Date(2017, 5, 2)};
  const a4 = {'id': 4, 'level1': {'level2': 'asd'}, 'date': new Date(2016, 5, 2)};
  const list2 = [a2, a3, a4, a1];

  it('should sort list2', async(() => {
    expect(sort(list2, 'id, date, level1.level2', false)).toEqual([a4, a3, a2, a1]);
    expect(sort(list2, 'level1.level2', false)).toEqual([a2, a1, a4, a3]);
    expect(sort(list2, 'level1.level2', true)).toEqual([a4, a3, a1, a2]);
    expect(sort(list2, 'level1.level2, id', true)).toEqual([a3, a4, a1, a2]);
    expect(sort(list2, 'level1.level2, date', true)).toEqual([a4, a3, a1, a2]);
    expect(sort(list2, 'date', true)).toEqual([a2, a4, a3, a1]);
    expect(sort(list2, '-level1.level2', true)).toEqual([a2, a1, a4, a3]);
    expect(sort(list2, 'level1.level2', false)).toEqual([a2, a1, a4, a3]);
    expect(sort(list2, 'level1.level2, -date', true)).toEqual([a3, a4, a1, a2]);
    expect(sort(list2, 'level1.level2, -id', true)).toEqual([a4, a3, a1, a2]);
    expect(sort(list2, 'id, -date, -level1.level2', false)).toEqual([a4, a3, a2, a1]);
  }));

  const b1 = {'id': 1, 'level1': {'level2': 'a'}, 'date': new Date(2018, 6, 1)};
  const b2 = {'id': 2, 'level1': {'level2': 'a'}, 'date': new Date(2018, 6, 1)};
  const b3 = {'id': 3, 'level1': {'level2': 'a'}, 'date': new Date(2017, 5, 2)};
  const b4 = {'id': 4, 'level1': {'level2': 'a'}, 'date': new Date(2016, 5, 2)};
  const list3 = [b2, b3, b4, b1];

  it('should sort list3', async(() => {
    expect(sort(list3, 'id, date, level1.level2', false)).toEqual([b4, b3, b2, b1]);
    expect(sort(list3, 'date, id, -level1.level2', true)).toEqual([b4, b3, b1, b2]);
    expect(sort(list3, '-date, id, -level1.level2', true)).toEqual([b1, b2, b3, b4]);
    expect(sort(list3, '-date, -id, -level1.level2', true)).toEqual([b2, b1, b3, b4]);
    expect(sort(list3, '-date, -level1.level2, -id', true)).toEqual([b2, b1, b3, b4]);
    expect(sort(list3, 'level1.level2, -date, -id', true)).toEqual([b2, b1, b3, b4]);
  }));

  const l1 = {a: 'š'};
  const l2 = {a: 'y'};
  const l3 = {a: 'ž'};

  LIB_CONTEXT.locale = 'et';
  it('should sort locale', async(() => {
    expect(sort([l1, l2, l3], 'a', true)).toEqual([l1, l3, l2]);
  }));

});
