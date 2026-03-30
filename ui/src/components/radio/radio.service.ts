import {Injectable} from '@angular/core';
import {ReplaySubject} from 'rxjs';


@Injectable()
export class MuiRadioService {
  public selected$ = new ReplaySubject<any>(1);
  public disabled$ = new ReplaySubject<boolean>(1);

  public select(value: any): void {
    this.selected$.next(value);
  }

  public setDisabled(value: boolean): void {
    this.disabled$.next(value);
  }
}
