import {DistanceInWordsPipe} from './distance-in-words-pipe';

describe('DistanceInWordsPipe', () => {

  const translateService: any = {
    instant(key: string | Array<string>, interpolateParams?: Object): string | any {
      if (key === 'core.pipe.distance-in-words.today') {
        return 'today';
      }
      if (key === 'core.pipe.distance-in-words.yesterday') {
        return 'yesterday';
      }
      if (key === 'core.pipe.distance-in-words.days') {
        return 'days ago';
      }
      if (key === 'core.pipe.distance-in-words.weeks') {
        return 'week(s) ago';
      }
      if (key === 'core.pipe.distance-in-words.months') {
        return 'month(s) ago';
      }
      if (key === 'core.pipe.distance-in-words.year') {
        return 'more than year ago';
      }
      if (key === 'core.pipe.distance-in-words.more-than') {
        return 'more than';
      }
    }
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
