import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable} from 'rxjs';
import {OAuthStorageService} from './oauth-storage.service';
import {Injectable} from '@angular/core';

@Injectable()
export class OauthHttpInterceptor implements HttpInterceptor {

  constructor(private oAuthStorageService: OAuthStorageService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const oauthInfo = this.oAuthStorageService.getOAuthInfo();
    if (oauthInfo && oauthInfo.accessToken) {
      if (!req.headers.has('Authorization')) {
        req = req.clone({
          setHeaders: {
            'Authorization': `Bearer ${oauthInfo.accessToken}`
          }
        });
      }
    }
    return next.handle(req);
  }
}
