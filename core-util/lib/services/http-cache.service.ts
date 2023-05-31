import {Observable, shareReplay} from 'rxjs';
import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class HttpCacheService {
  private cache: {[key: string]: Observable<any>} = {};

  /**
   * @deprecated use put(key: string, request: Observable<T>)
   */
  public getCachedResponse<T>(key: string, request: Observable<T>): Observable<T> {
    console.error('Use put() method instead!');
    throw this.put(key, request);
  }

  public get<T>(key: string): Observable<T> {
    return this.cache[key];
  }

  public put<T>(key: string, request: Observable<T>): Observable<T> {
    if (!this.cache[key]) {
      this.cache[key] = request.pipe(shareReplay(1));
    }
    return this.cache[key];
  }

  public remove(key: string): void {
    delete this.cache[key];
  }

  public clear(): void {
    this.cache = {};
  }
}


