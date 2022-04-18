import {Injectable} from '@angular/core';

@Injectable({providedIn: 'root'})
export class SessionStorageService {
  public put(key: string, content: any): void {
    sessionStorage.setItem(key, JSON.stringify(content));
  }

  public get(key: string): any {
    return JSON.parse(sessionStorage.getItem(key));
  }
}
