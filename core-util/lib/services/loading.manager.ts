import {Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';

export class LoadingManager {
  private _loading: {[key: string]: number} = {};
  private _state: {[key: string]: boolean} = {};

  public start(key: string): void {
    this._loading[key] = (this._loading[key] ?? 0) + 1;
    this._state[key] = this._loading[key] > 0;
  }

  public stop(key: string): void {
    this._loading[key] = (this._loading[key] ?? 0) - 1;
    this._state[key] = this._loading[key] > 0;
  }

  public wrap<T>(key: string, obs: Observable<T>): Observable<T> {
    this.start(key);
    return obs.pipe(finalize(() => this.stop(key)));
  }


  public get isLoading(): boolean {
    return this.isLoadingExcept();
  }

  public isLoadingExcept(...exclude: string[]): boolean {
    return Object.keys(this.state).filter(k => !exclude.includes(k)).some(k => this.state[k]);
  }


  public get state(): {[key: string]: boolean} {
    return this._state;
  }
}
