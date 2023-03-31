import {Observable, shareReplay} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class HttpCacheService {
  private cache: {[key: string]: Observable<any>} = {};

  public getCachedResponse<T>(key: string, request: Observable<T>): Observable<T> {
      if (!this.cache[key]) {
      this.cache[key] = request.pipe(shareReplay(1));
    }
    return this.cache[key];
  }
}
