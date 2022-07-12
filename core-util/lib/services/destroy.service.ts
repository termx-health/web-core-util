import {Injectable, OnDestroy} from '@angular/core';
import {Subject} from 'rxjs';

/*
NB: DO NOT forget to provide service to component!
@Component({
  ...
  providers: [DestroyService]
})

DestroyService alternative:

class FancyComponent implements OnDestroy {
  private readonly destroy$ = new Subject<void>();

  public ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
*/

@Injectable()
export class DestroyService extends Subject<void> implements OnDestroy {
  public ngOnDestroy(): void {
    this.next();
    this.complete();
  }
}
