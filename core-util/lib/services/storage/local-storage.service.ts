import {Injectable} from '@angular/core';
import {isDefined} from '../../utils';

@Injectable({providedIn: 'root'})
export class LocalStorageService {
  public put(key: string, content: any): void {
    localStorage.setItem(key, JSON.stringify(content));
  }

  public get(key: string): any {
    const obj = localStorage.getItem(key);
    if (isDefined(obj)) {
      return JSON.parse(obj!);
    }
  }

  public remove(key: string): void {
    localStorage.removeItem(key);
  }
}
