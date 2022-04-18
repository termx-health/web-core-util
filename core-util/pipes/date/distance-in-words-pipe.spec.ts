import {DistanceInWordsPipe} from './distance-in-words-pipe';
import {Observable, of} from 'rxjs';
import {EventEmitter} from '@angular/core';

describe('DistanceInWordsPipe', () => {

  const translateService: any = {
    get(key: string | Array<string>, params?: any): Observable<string> {
      if (key === 'core.pipe.distance-in-words.today') {
        return of('today');
      }
      if (key === 'core.pipe.distance-in-words.yesterday') {
        return of('yesterday');
      }
      if (key === 'core.pipe.distance-in-words.days' && params.days == 2) {
        return of('2 days ago');
      }
      if (key === 'core.pipe.distance-in-words.weeks' && params.weeks == 2) {
        return of('more than 2 week(s) ago');
      }
      if (key === 'core.pipe.distance-in-words.months' && params.months == 2) {
        return of('more than 2 month(s) ago');
      }
      if (key === 'core.pipe.distance-in-words.year') {
        return of('more than year ago');
      }
      if (key === 'core.pipe.distance-in-words.more-than') {
        return of('more than');
      }
      return of(null);
    },
    localeChange: new EventEmitter(),
    translationChange: new EventEmitter()
  };

  const pipe = new DistanceInWordsPipe(null, translateService);
  it('should return distance date as words', async () => {
    let today = new Date();
    expect(pipe.transform(today)).toEqual('today');
    expect(pipe.transform(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1))).toEqual('yesterday');
    expect(pipe.transform(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 2))).toEqual('2 days ago');
    expect(pipe.transform(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 15))).toEqual('more than 2 week(s) ago');
    expect(pipe.transform(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 70))).toEqual('more than 2 month(s) ago');
    expect(pipe.transform(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 370))).toEqual('more than year ago');
  });

});
