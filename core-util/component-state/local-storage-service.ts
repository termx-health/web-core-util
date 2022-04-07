import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {

  public put(key: string, content: any): void {
    localStorage.setItem(key, JSON.stringify(content));
  }

  public get(key: string): any {
    return JSON.parse(localStorage.getItem(key));
  }

}
