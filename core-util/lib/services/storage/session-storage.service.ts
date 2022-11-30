import {Injectable} from '@angular/core';
import {isDefined} from '../../utils';

@Injectable({providedIn: 'root'})
export class SessionStorageService {
  public put(key: string, content: any): void {
    sessionStorage.setItem(key, JSON.stringify(content));
  }

  public get(key: string): any {
    const obj = sessionStorage.getItem(key);
    if (isDefined(obj)) {
      return JSON.parse(obj!);
    }
  }

  public remove(key: string): void {
    sessionStorage.removeItem(key);
  }
}
