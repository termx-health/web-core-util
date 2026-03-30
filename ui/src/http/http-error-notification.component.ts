import {Component, DestroyRef, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {MuiHttpErrorNotificationService} from './http-error-handler';
import {MuiNotificationService} from '../components';
import {Clipboard} from '@angular/cdk/clipboard';

@Component({
  standalone: false,
  selector: 'm-http-error-notification',
  template: `
    <ng-template #contentTpl let-data>
      <div class="m-justify-between">{{data['_message']}}</div>

      <ng-container *ngIf="{isShown: false, details: data['details']} as v">
        <div class="details-wrapper" *ngIf="v.details">
          <div class="m-justify-between">
            <div class="m-items-middle m-clickable m-bold" (click)="v.isShown = !v.isShown">
              <span>{{(v.isShown ? 'marina.ui.http.hideDetails' : 'marina.ui.http.showDetails') | i18n}}</span>
              <m-icon [mCode]="v.isShown ? 'caret-up' : 'caret-down'"></m-icon>
            </div>

            <span class="m-items-middle m-clickable" *ngIf="v.isShown" (click)="data['_copy']()">
              <m-icon mCode="copy"></m-icon>
              <span>{{'marina.ui.http.copyDetails' | i18n}}</span>
            </span>
          </div>

          <div class="details" *ngIf="v.isShown">{{v.details}}</div>
        </div>
      </ng-container>
    </ng-template>
  `,
  styles: [`
    .details-wrapper {
      margin-top: 0.5rem
    }

    .details {
      margin-top: 0.5rem;
      white-space: pre;

      overflow: auto;
      max-height: 50vh;
    }`]
})
export class MuiHttpErrorNotificationComponent implements OnInit {
  @ViewChild('contentTpl') private contentTpl: TemplateRef<any>;

  public constructor(
    private notificationService: MuiNotificationService,
    private httpErrorNotificationService: MuiHttpErrorNotificationService,
    private clipboard: Clipboard,
    private destroyRef: DestroyRef
  ) { }

  public ngOnInit(): void {
    const hookRef = this.httpErrorNotificationService.registerHook((title, message, options) => {
      options.data['_message'] = message;
      options.data['_copy'] = () => this.copyNotifications(title as string, message as string, options.data['details'])
      this.notificationService.error(title, this.contentTpl, options);
    });

    this.destroyRef.onDestroy(() => hookRef());
  }


  private copyNotifications(title: string, content: string, details: string): void {
    let message = `${title}: ${content}\n`;
    if (details) {
      message += `\n-- Error details --\n${details}`;
    }
    this.clipboard.copy(message);
  }
}
