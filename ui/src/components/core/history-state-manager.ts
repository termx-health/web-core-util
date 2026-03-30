import {v4 as uuid} from 'uuid';

export class HistoryStateManager {
  private _historyStates = {prev: null, cur: null};

  public pushState(): void {
    const prevState = history.state;
    history.pushState({id: uuid()}, null);
    this._historyStates = {prev: prevState, cur: history.state};
  }

  public resetState(): void {
    if (this.isCurrent) {
      history.back();
    }
  }

  public get isCurrent(): boolean {
    return history.state.id === this._historyStates.cur?.id;
  }

  public get isPrevious(): boolean {
    return history.state.id === this._historyStates.prev?.id;
  }
}
