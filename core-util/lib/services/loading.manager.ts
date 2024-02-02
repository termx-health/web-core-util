import {Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';

export class LoadingManager<K extends string> {
  private _loading: Partial<Record<K, number>> = {};
  private _state: Partial<Record<K, boolean>> = {};

  public start(key: K): void {
    this._loading[key] = (this._loading[key] ?? 0) + 1;
    this._state[key] = this._loading[key]! > 0;
  }

  public stop(key: K): void {
    this._loading[key] = (this._loading[key] ?? 0) - 1;
    this._state[key] = this._loading[key]! > 0;
  }

  public wrap<T>(key: K, obs: Observable<T>): Observable<T> {
    this.start(key);
    return obs.pipe(finalize(() => this.stop(key)));
  }


  public get isLoading(): boolean {
    return this.isLoadingExcept();
  }

  public isLoadingExcept(...exclude: K[]): boolean {
    return (Object.keys(this.state) as K[]).filter(k => !exclude.includes(k)).some(k => this.state[k]);
  }


  public get state(): LoadingManager<K>['_state'] {
    return this._state;
  }
}
