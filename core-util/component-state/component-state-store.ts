import {Injectable} from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ComponentStateStore {
  private store: {[key: string]: any} = {};

  public clear(): void {
    this.store = {};
  }

  public put(key: string, content: any): void {
    this.store[key] = content;
  }

  public get(key: string): any {
    return this.store[key];
  }

  public pop(key: string): any {
    const val = this.get(key);
    delete this.store[key];
    return val;
  }

}
