import {async} from '@angular/core/testing';
import {AbbreviatePipe} from './abbreviate-pipe';

describe('AbbreviatePipe', () => {
  const pipe = new AbbreviatePipe();
  it('should abbreviate', async(() => {
    expect(pipe.transform(null, null)).toEqual(null);
    expect(pipe.transform('1234567890', null)).toEqual('1234567890');
    expect(pipe.transform('1234567890', 10)).toEqual('1234567890');
    expect(pipe.transform('1234567890', 9)).toEqual('123456...');
  }));
});
