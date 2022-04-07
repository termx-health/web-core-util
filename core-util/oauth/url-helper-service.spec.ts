import {async} from '@angular/core/testing';
import {UrlHelperService} from './url-helper-service';

describe('UrlHelperService', () => {

  it('hash fragments', async(() => {
    const service = new UrlHelperService();
    expect(service.getHashFragmentParams('bla#bla')).toEqual({});
    expect(service.getHashFragmentParams('#bla')).toEqual({bla: 'null'});
    expect(service.getHashFragmentParams(null)).toEqual({});
    expect(service.getHashFragmentParams('#access_token=sdf=sdf&expires_in=3000')).toEqual({
      access_token: 'sdf=sdf',
      expires_in: '3000'
    });
  }));


});
