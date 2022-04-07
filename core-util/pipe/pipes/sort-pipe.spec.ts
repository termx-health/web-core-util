import {SortPipe} from './sort-pipe';
import {async} from '@angular/core/testing';

describe('SortPipe', () => {

  const pipe = new SortPipe();
  const o1 = {'id': 1, 'level1': {'level2': 'Bsa'}, 'date': new Date(2018, 6, 1)};
  const o2 = {'id': 2, 'level1': {'level2': 'dsa'}, 'date': new Date(2013, 5, 1)};
  const o3 = {'id': 3, 'level1': {'level2': 'asd'}, 'date': new Date(2017, 5, 2)};
  const o4 = {'id': 4};
  const list = [o2, o3, o4, o1];

  it('should sort list', async(() => {
    expect(pipe.transform(list, null, 'ascend')).toEqual([o2, o3, o4, o1]);
    expect(pipe.transform(list, null, null)).toEqual([o2, o3, o4, o1]);
    expect(pipe.transform(list, 'id', null)).toEqual([o1, o2, o3, o4]);
    expect(pipe.transform(list, 'id', 'descend')).toEqual([o4, o3, o2, o1]);
    expect(pipe.transform(list, 'level1.level2', 'ascend')).toEqual([o4, o3, o1, o2]);
    expect(pipe.transform(list, 'date', 'descend')).toEqual([o4, o1, o3, o2]);
    expect(pipe.transform(list, 'date', 'ascend')).toEqual([o4, o2, o3, o1]);
  }));
});
