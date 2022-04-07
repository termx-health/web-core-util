import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {fromEvent, of, Subject, throwError} from 'rxjs';
import {delay, first, map, switchMap, timeoutWith} from 'rxjs/operators';
import {OauthConfig} from './oauth-config';
import {OAuthInfo} from './oauth-info';
import {OAuthStorageService} from './oauth-storage.service';
import {OidcDiscoveryConf} from './oidc-discovery-conf';
import {UrlHelperService} from './url-helper-service';
import {UserInfo} from '../auth/user-info';
import {SavedLocationService} from './saved-location.service';
import {mutex, timeoutPromise} from '../util/mutex.util';

@Injectable({ providedIn: 'root' })
export class OAuthService {

  config: OauthConfig;

  discoveryConf: OidcDiscoveryConf;

  silentRefreshIFrameName = 'silent_refresh_iframe';
  silentRefreshTimeout = 5000;

  newOAuthInfoSubject = new Subject<OAuthInfo>();

  claimProducer: (silent: boolean) => any;
  loginHintProducer: () => string;

  constructor(private http: HttpClient,
    private oAuthStorageService: OAuthStorageService,
    private savedLocationService: SavedLocationService,
    private urlHelperService: UrlHelperService) {
      this.registerSilentRefreshTimer();
  }

  private determineSilentRefreshTimeMs(oi: OAuthInfo) {
    const silentRefresh = (this.config.silentRefresh || -60) * 1000;
    const exp = oi.exp - 5000;
    if (silentRefresh < 0) {
      return exp + silentRefresh;
    } else {
      const resTime = new Date().getTime() + silentRefresh;
      if (resTime < exp) {
        return resTime;
      } else {
        return exp;
      }
    }
  }

  private determineSilentRefreshTime(oi: OAuthInfo) {
    const res = new Date(this.determineSilentRefreshTimeMs(oi));
    console.log('Setting silent refresh at not later than', res);
    return res;
  }

  private registerSilentRefreshTimer() {
    this.newOAuthInfoSubject.pipe(
      switchMap(oi => of(oi).pipe(
          delay(this.determineSilentRefreshTime(oi))
        )
      )
    ).subscribe(_ => {
      console.log('Triggering silent refresh');
      this.silentRefresh().then(oi => {
        this.oAuthStorageService.saveOAuthInfo(oi);
        this.oAuthStorageService.event.next(null);
      });
    });
  }

  private getBaseHref() {
    const bases = document.getElementsByTagName('base');
    if (bases.length > 0) {
      return bases[0].href;
    } else {
      return window.location.origin + '/';
    }
  }
  public configure(config: OauthConfig) {
    this.config = config;
    config.redirectUri = config.redirectUri || this.getBaseHref() + 'auth.html';
    config.responseType = config.responseType || 'token';
  }

  public setClaimProducer(claimProducer: (silent: boolean) => any) {
    this.claimProducer = claimProducer;
  }

  public setLoginHintProducer(loginHintProducer: () => string) {
    this.loginHintProducer = loginHintProducer;
  }

  public async loadOauthInfo() {
    if (this.oAuthStorageService.hasNewHash()) {
      return this.processNewHash();
    }
    return this.getStoredUser() || this.silentRefresh();
  }

  public async loadUser() {
    const oi = await this.loadOauthInfo();
    this.oAuthStorageService.saveOAuthInfo(oi);
    this.newOAuthInfoSubject.next(oi);
    return oi.userInfo;
  }

  public getStoredUser() {
    if (this.config.loginHint) {
      return null;
    }
    const oauthInfo = this.oAuthStorageService.getOAuthInfo();
    if (oauthInfo != null && !this.expired(oauthInfo)) {
        return oauthInfo;
    }
    return null;
  }

  expired(oAuthInfo: OAuthInfo) {
    return oAuthInfo.exp < new Date().getTime();
  }

  public async processNewHash() {
    console.log('Found a new oauth2 hash in storage');
    const hash = this.oAuthStorageService.getNewHash();
    this.oAuthStorageService.deleteNewHash();
    this.savedLocationService.restoreLocation();
    return this.processHash(hash);
  }

  public async processHash(hash: string): Promise<OAuthInfo> {
    console.log('Processing oauth2 hash:', hash);
    const oauthInfo = this.parseHash(hash);
    oauthInfo.userInfo = await this.queryUserInfo(oauthInfo.accessToken) as UserInfo;
    console.log('Loaded oauthInfo:', oauthInfo);
    return oauthInfo;
  }

  parseHash(hash: string): OAuthInfo {
    const params = this.urlHelperService.getHashFragmentParams(hash);
    if (params) {
      if (params['error']) {
        throw `${params['error']}:${params['error_description']}.${params['error_hint']}`;
      } else {
        const expiresIn = parseInt(params['expires_in'], 10);
        if (!isNaN(expiresIn) && params['access_token']) {
          return {
            accessToken: params['access_token'],
            exp: expiresIn * 1000 + new Date().getTime()
          };
        }
      }
    }
    throw 'Unrecognized hash';
  }

  async queryUserInfo(at: string) {
    const x = await this.loadDiscoveryDocument();
    try {
      return this.http.get(x.userinfo_endpoint, {
        headers: {
          'Authorization': `Bearer ${at}`
        }
      }).toPromise();
    } catch (e) {
      throw 'Could not load userinfo';
    }
  }

  public async loadDiscoveryDocument() {
    if (!this.discoveryConf) {
      try {
        this.discoveryConf = (await this.http
          .get(this.getDiscoveryUrl(this.config.issuer))
          .toPromise()) as OidcDiscoveryConf;
      } catch (e) {
        throw 'Could not load discovery document: ' + e;
      }
    }
    return this.discoveryConf;
  }

  getDiscoveryUrl(issuer: string) {
    return `${issuer}.well-known/openid-configuration`;
  }

  public redirectToLogin(claims: any = null) {
    this.savedLocationService.saveCurrentLocation();
    this.createAuthorizeUrl(false, claims).then(url => {
      window.location.href = url;
    });
  }

  private createClaims(claims: any) {
    return JSON.stringify({
      userinfo: claims
    });
  }

  protected async createAuthorizeUrl(noPrompt = false, claims = null) {
    const d = await this.loadDiscoveryDocument();
    const separationChar = d.authorization_endpoint.indexOf('?') > -1 ? '&' : '?';
    let url = d.authorization_endpoint + separationChar +
      'response_type=' +
      encodeURIComponent(this.config.responseType) +
      '&client_id=' +
      encodeURIComponent(this.config.client) +
      '&state=' +
      encodeURIComponent('no_state') +
      '&redirect_uri=' +
      encodeURIComponent(this.config.redirectUri) +
      '&scope=' +
      encodeURIComponent(this.config.scope);
    if (!claims) {
      if (this.claimProducer) {
        claims = this.claimProducer(noPrompt);
      }
    }
    if (claims) {
      url += '&claims=' + encodeURIComponent(this.createClaims(claims));
    }
    const loginHint = this.config.loginHint || (this.loginHintProducer ? this.loginHintProducer() : null);
    if (loginHint) {
      url += '&login_hint=' + encodeURIComponent(loginHint);
      url += '&prompt=login';
      noPrompt = false;
    }
    if (noPrompt) {
      url += '&prompt=none';
    }
    return url;
  }

  public logout() {
    this.oAuthStorageService.clearOAuthInfo();
    this.loadDiscoveryDocument().then(d => {
      window.location.href = d.end_session_endpoint;
    });
  }

  /**
 * Performs a silent refresh for implicit flow.
 * Use this method to get new tokens when/before
 * the existing tokens expire.
 */
  public async silentRefresh(): Promise<OAuthInfo> {
    let unlock = () => {};
    try {
      unlock = await mutex('silent-refresh-lock', 10000);
    } catch (e) {
      console.log('Could not refresh silently because of the lock. Waiting...');
      await timeoutPromise(5000);
      return this.loadOauthInfo();
    }
    console.log('Refreshing silently');
    if (typeof document === 'undefined') {
      throw new Error('silent refresh is not supported on this platform');
    }

    const existingIframe = document.getElementById(
      this.silentRefreshIFrameName
    );

    if (existingIframe) {
      document.body.removeChild(existingIframe);
    }

    const iframe = document.createElement('iframe');
    iframe.id = this.silentRefreshIFrameName;
    iframe.style['display'] = 'none';

    this.createAuthorizeUrl(true).then(url => {
      iframe.setAttribute('src', url);
      document.body.appendChild(iframe);
    });

    const res = fromEvent(window, 'message').pipe(
        map(e => (e as MessageEvent).data),
        map(d => d ? d['oauth-hash'] as string : null),
        first(d => !!d),
        timeoutWith(this.silentRefreshTimeout, throwError('Silent refresh timeout'))
      ).toPromise().then(hash => this.processHash(hash));
    res.finally(unlock);
    return res;
  }
}
