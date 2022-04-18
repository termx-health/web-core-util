import {waitForAsync} from '@angular/core/testing';
import {TextSearchPipe} from './text-search.pipe';

describe('TextSearchPipe', () => {
  const pipe = new TextSearchPipe();
  const o1 = {text: 'aaabbbccc', deep: {foo: 'bar'}};
  const o2 = {text: 'cccdddeee', deep: {foo: 'barometr'}};
  const list = [o1, o2];

  it('should filter', waitForAsync(() => {
    expect(pipe.transform(null, null)).toEqual([]);
    expect(pipe.transform([], null)).toEqual([]);
    expect(pipe.transform(list, null)).toEqual([o1, o2]);
    expect(pipe.transform(list, {})).toEqual([o1, o2]);

    expect(pipe.transform(list, {text: 'aaab'})).toEqual([o1]);
    expect(pipe.transform(list, {text: 'dd'})).toEqual([o2]);
    expect(pipe.transform(list, {text: 'ccc'})).toEqual([o1, o2]);
    expect(pipe.transform(list, {'deep.foo': 'bar'})).toEqual([o1, o2]);
    expect(pipe.transform(list, {'deep.foo': 'baro'})).toEqual([o2]);
    expect(pipe.transform(list, {'*': 'aaa'})).toEqual([o1]);
    expect(pipe.transform(list, {'*': 'ddd'})).toEqual([o2]);
    expect(pipe.transform(list, {'*': 'ccc'})).toEqual([o1, o2]);
    expect(pipe.transform(list, {'*': 'bar'})).toEqual([o1, o2]);
    expect(pipe.transform(list, {'*': 'baro'})).toEqual([o2]);
  }));
});
