import {async} from '@angular/core/testing';
import {FilterPipe} from './filter-pipe';

describe('FilterPipe', () => {
  const pipe = new FilterPipe();
  it('shoult filter', async(() => {
    expect(pipe.transform([1, 2, 3], null, null)).toEqual([1, 2, 3]);
    expect(pipe.transform([1, 2, 3], (row) => true, null)).toEqual([1, 2, 3]);
    expect(pipe.transform([1, 2, 3], (row) => row > 1, null)).toEqual([2, 3]);
    expect(pipe.transform([1, 2, 3], (row, arg) => row > arg, 2)).toEqual([3]);
  }));
});
