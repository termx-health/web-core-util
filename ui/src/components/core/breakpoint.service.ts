import {Injectable} from '@angular/core';
import {BreakpointObserver, BreakpointState} from '@angular/cdk/layout';
import {Observable} from 'rxjs';


@Injectable()
export class MuiBreakpointService {
  public constructor(
    private breakpointObserver: BreakpointObserver,
  ) { }

  public observe(params: string | string[] = '(max-width: 768px)'): Observable<BreakpointState> {
    // todo: take default params from config
    return this.breakpointObserver.observe(params);
  }
}
