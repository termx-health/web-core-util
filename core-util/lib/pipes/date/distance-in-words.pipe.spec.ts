import {DistanceInWordsPipe} from './distance-in-words.pipe';
import {EventEmitter} from '@angular/core';

describe('DistanceInWordsPipe', () => {

  const translateService: any = {
    instant(key: string, params?: any): string {
      if (key === 'core.pipe.distanceInWords.today') {
        return 'today';
      }
      if (key === 'core.pipe.distanceInWords.yesterday') {
        return 'yesterday';
      }
      if (key === 'core.pipe.distanceInWords.days' && params.days == 2) {
        return '2 days ago';
      }
      if (key === 'core.pipe.distanceInWords.weeks' && params.weeks == 2) {
        return 'more than 2 week(s) ago';
      }
      if (key === 'core.pipe.distanceInWords.months' && params.months == 2) {
        return 'more than 2 month(s) ago';
      }
      if (key === 'core.pipe.distanceInWords.year') {
        return 'more than year ago';
      }
      if (key === 'core.pipe.distanceInWords.more-than') {
        return 'more than';
      }
      return key;
    },
    localeChange: new EventEmitter(),
    translationChange: new EventEmitter()
  };

  const pipe = new DistanceInWordsPipe(translateService);
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
