import {Inject, Injectable} from '@angular/core';
import {LOCAL_STORAGE, StorageService} from 'ngx-webstorage-service';
import {asyncScheduler, Observable, Subject} from 'rxjs';
import {throttleTime} from 'rxjs/operators';
import {OAuthInfo} from './oauth-info';

@Injectable({ providedIn: 'root' })
export class OAuthStorageService {
  private oAuthInfo: OAuthInfo;
  event = new Subject();

  constructor(@Inject(LOCAL_STORAGE) private storageService: StorageService) {
  }

  public hasNewHash() {
    return this.getNewHash() != null;
  }

  public getNewHash() {
    return localStorage.getItem('oauth-new');
  }

  public deleteNewHash() {
    localStorage.removeItem('oauth-new');
  }

  public getOAuthInfo(): OAuthInfo {
    if (this.oAuthInfo == null) {
      this.oAuthInfo = this.storageService.get('oauth-info');
    }
    return this.oAuthInfo;
  }

  public saveOAuthInfo(oauthInfo: OAuthInfo) {
    this.oAuthInfo = oauthInfo;
    this.storageService.set('oauth-info', oauthInfo);
  }

  public removeOAuthInfo() {
    this.oAuthInfo = null;
    this.clearOAuthInfo();
    this.event.next(null);
  }

  public clearOAuthInfo() {
    this.storageService.remove('oauth-info');
  }

  public getEvent(): Observable<any> {
    return this.event.pipe(
      throttleTime(5000, asyncScheduler, {
        leading: true,
        trailing: true
      })
    );
  }
}
