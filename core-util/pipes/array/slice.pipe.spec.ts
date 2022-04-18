import {waitForAsync} from '@angular/core/testing';
import {SlicePipe} from './slice.pipe';

describe('SlicePipe', () => {
  const pipe = new SlicePipe();
  const arr = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

  it('should slice', waitForAsync(() => {
    expect(pipe.transform(null, null)).toEqual(null);
    expect(pipe.transform([], null)).toEqual([]);
    expect(pipe.transform('foo', null)).toEqual('foo');
    expect(pipe.transform('foobar', 4)).toEqual('foob');
    expect(pipe.transform(arr, null)).toEqual(arr);
    expect(pipe.transform(arr, 3)).toEqual([0, 1, 2]);
    expect(pipe.transform(arr, 2)).toEqual([0, 1]);
    expect(pipe.transform(arr, 2, 2)).toEqual([2, 3]);
  }));
});
