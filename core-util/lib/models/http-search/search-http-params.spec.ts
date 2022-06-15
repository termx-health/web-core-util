import {waitForAsync} from '@angular/core/testing';
import {SearchHttpParams} from './search-http-params';

describe('SearchHttpParams', () => {

  it('null query', waitForAsync(() => {
    const p = SearchHttpParams.build(null);
    expect(p.keys()).toEqual([]);
  }));

  it('empty query', waitForAsync(() => {
    const p = SearchHttpParams.build({});
    expect(p.keys()).toEqual([]);
  }));

  it('simple query', waitForAsync(() => {
    const p = SearchHttpParams.build({a: 'bbb'});
    expect(p.keys()).toEqual(['a']);
    expect(p.getAll('a')).toEqual(['bbb']);
  }));

  it('array', waitForAsync(() => {
    const p = SearchHttpParams.build({a: ['bbb', 'ccc']});
    expect(p.keys()).toEqual(['a']);
    expect(p.getAll('a')).toEqual(['bbb', 'ccc']);
  }));

  it('array-array', waitForAsync(() => {
    const p = SearchHttpParams.build({a: [['a1', 'a2'], ['b1', 'b2']]});
    expect(p.keys()).toEqual(['a']);
    expect(p.getAll('a')).toEqual(['a1,a2', 'b1,b2']);
  }));

  it('date', waitForAsync(() => {
    const p = SearchHttpParams.build({a: new Date('2010-10-10T10:10:10+03:00')});
    expect(p.keys()).toEqual(['a']);
    expect(p.getAll('a')).toEqual(['2010-10-10T07:10:10.000Z']);
  }));

  it('date-array', waitForAsync(() => {
    const p = SearchHttpParams.build({a: [[new Date('2010-10-15T10:10:10+03:00')], [new Date('2010-10-21T10:10:10+03:00')]]});
    expect(p.keys()).toEqual(['a']);
    expect(p.getAll('a')).toEqual(['2010-10-15T07:10:10.000Z', '2010-10-21T07:10:10.000Z']);
  }));

  it('date-array-array', waitForAsync(() => {
    const p = SearchHttpParams.build({a: [[new Date('2010-10-20T10:10:10+03:00'), new Date('2010-10-21T10:10:10+03:00')]]});
    expect(p.keys()).toEqual(['a']);
    expect(p.getAll('a')).toEqual(['2010-10-20T07:10:10.000Z,2010-10-21T07:10:10.000Z']);
  }));
});
