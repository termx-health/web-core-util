import {waitForAsync} from '@angular/core/testing';
import {SearchPipe} from './search.pipe';

describe('SearchPipe', () => {
  const pipe = new SearchPipe();
  const o1 = {number: 1, text: 'aaa', deep: {foo: 'bar'}};
  const o2 = {number: 2, text: 'bbb', deep: {foo: 'fighters', must: {go: {deeper: 'dicaprio'}}}};
  const list = [o1, o2];

  it('should filter', waitForAsync(() => {
    expect(pipe.transform(null, null)).toEqual([]);
    expect(pipe.transform([], null)).toEqual([]);
    expect(pipe.transform(list, null)).toEqual([o1, o2]);
    expect(pipe.transform(list, {})).toEqual([o1, o2]);

    expect(pipe.transform(list, {number: 1})).toEqual([o1]);
    expect(pipe.transform(list, {number: 2})).toEqual([o2]);
    expect(pipe.transform(list, {number: 333})).toEqual([]);
    expect(pipe.transform(list, {text: 'aaa'})).toEqual([o1]);
    expect(pipe.transform(list, {number: 1, text: 'aaa'})).toEqual([o1]);
    expect(pipe.transform(list, {number: 2, text: 'aaa'})).toEqual([]);
    expect(pipe.transform(list, {'deep.foo': 'bar'})).toEqual([o1]);

    expect(pipe.transform(list, {'text,deep.foo': 'aaa'})).toEqual([o1]);
    expect(pipe.transform(list, {'text,deep.foo': 'bar'})).toEqual([o1]);
    expect(pipe.transform(list, {'text,deep.foo': 'parabola'})).toEqual([]);


    expect(pipe.transform(list, {'*': 'aaa'})).toEqual([o1]);
    expect(pipe.transform(list, {'*': 1})).toEqual([o1]);
    expect(pipe.transform(list, {'*': 'bbb'})).toEqual([o2]);
    expect(pipe.transform(list, {'*': 'bar'})).toEqual([o1]);
    expect(pipe.transform(list, {'*': 'fighters'})).toEqual([o2]);

    expect(pipe.transform(list, {'deep.*': 'aaa'})).toEqual([]);
    expect(pipe.transform(list, {'deep.*': 1})).toEqual([]);
    expect(pipe.transform(list, {'deep.*': 'bbb'})).toEqual([]);
    expect(pipe.transform(list, {'deep.*': 'bar'})).toEqual([o1]);
    expect(pipe.transform(list, {'deep.*': 'fighters'})).toEqual([o2]);
    expect(pipe.transform(list, {'deep.*': 'dicaprio'})).toEqual([o2]);
  }));
});
