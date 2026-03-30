import {ChangeDetectionStrategy, ChangeDetectorRef, Component, DestroyRef, ViewEncapsulation} from '@angular/core';
import {collect} from '@termx-health/core-util';
import {MuiNotificationContainerBaseComponent} from './notification.base';
import {MuiNotificationEntity, MuiNotificationPlacement} from './notification';
import {DEFAULT_NOTIFICATION_CONFIG, MuiConfigService} from '../../config';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';


@Component({
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  template: `
    <div class="m-notification-container m-notification-container--top-left" [style.top]="top" [style.left]="left">
      <ng-template [ngTemplateOutlet]="instanceRendered" [ngTemplateOutletContext]="{instance: _instances.topLeft}"></ng-template>
    </div>

    <div class="m-notification-container m-notification-container--top-center" [style.top]="top">
      <ng-template [ngTemplateOutlet]="instanceRendered" [ngTemplateOutletContext]="{instance: _instances.top}"></ng-template>
    </div>

    <div class="m-notification-container m-notification-container--top-right" [style.top]="top" [style.right]="right">
      <ng-template [ngTemplateOutlet]="instanceRendered" [ngTemplateOutletContext]="{instance: _instances.topRight}"></ng-template>
    </div>


    <div class="m-notification-container m-notification-container--bottom-left" [style.bottom]="bottom" [style.left]="left">
      <ng-template [ngTemplateOutlet]="instanceRendered" [ngTemplateOutletContext]="{instance: _instances.bottomLeft}"></ng-template>
    </div>

    <div class="m-notification-container m-notification-container--bottom-center" [style.bottom]="bottom">
      <ng-template [ngTemplateOutlet]="instanceRendered" [ngTemplateOutletContext]="{instance: _instances.bottom}"></ng-template>
    </div>

    <div class="m-notification-container m-notification-container--bottom-right" [style.bottom]="bottom" [style.right]="right">
      <ng-template [ngTemplateOutlet]="instanceRendered" [ngTemplateOutletContext]="{instance: _instances.bottomRight}"></ng-template>
    </div>


    <ng-template #instanceRendered let-instances="instance">
      <m-notification
        *ngFor="let instance of instances"
        [mEntity]="instance"
        (mClose)="remove(instance.messageId, true)"
      ></m-notification>
    </ng-template>
  `
})
export class MuiNotificationContainerComponent extends MuiNotificationContainerBaseComponent {
  public top: string;
  public bottom: string;
  public left: string;
  public right: string;

  public _instances: { [placement in MuiNotificationPlacement]?: MuiNotificationEntity[] } = {};

  public constructor(
    cdr: ChangeDetectorRef,
    configService: MuiConfigService,
    private destroyRef: DestroyRef
  ) {
    super(cdr, configService);
  }


  protected override subscribeConfigChange(): void {
    this.configService.getConfigChange('notifications').pipe(takeUntilDestroyed(this.destroyRef)).subscribe(() => this.updateConfig());
  }

  protected override updateConfig(): void {
    this.config = {
      ...DEFAULT_NOTIFICATION_CONFIG,
      ...this.configService.getConfigFor('notifications')
    };

    const toOffsetStyle = (offset: number | string): string => typeof offset === 'number' ? `${offset}px` : offset;
    this.top = toOffsetStyle(this.config.top);
    this.bottom = toOffsetStyle(this.config.bottom);
    this.left = toOffsetStyle(this.config.left);
    this.right = toOffsetStyle(this.config.right);
  }

  protected override readyInstances(): void {
    this._instances = collect(this.instances, x => x.options.placement || 'topRight');
    super.readyInstances();
  }
}

