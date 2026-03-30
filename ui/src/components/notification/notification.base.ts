import {ChangeDetectorRef, Directive, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {MuiConfigService, MuiNotificationConfig} from '../../config';
import {MuiNotificationEntity, MuiNotificationEntityOptions} from './notification';


@Directive({ standalone: false })
export abstract class MuiNotificationContainerBaseComponent implements OnInit {

  public config: MuiNotificationConfig;
  public instances: MuiNotificationEntity[] = [];

  protected constructor(
    protected cdr: ChangeDetectorRef,
    protected configService: MuiConfigService
  ) {
    this.updateConfig();
  }

  public ngOnInit(): void {
    this.subscribeConfigChange();
  }

  protected abstract updateConfig(): void;

  protected abstract subscribeConfigChange(): void;

  protected readyInstances(): void {
    this.cdr.markForCheck();
  }


  public create(ref: MuiNotificationEntity): Required<MuiNotificationEntity> {
    const instance = this.onCreate({...ref});
    const key = ref.options?.messageKey;
    const sameKeyInstance = this.instances.find(i => i.options?.messageKey === key);

    if (key && sameKeyInstance) {
      this.replaceNotification(sameKeyInstance, instance);
    } else {
      this.instances = [...this.instances, instance];
    }

    this.readyInstances();
    return instance;
  }

  public remove(id: string, manualClick: boolean = false): void {
    const instance = this.instances.find(instance => instance.messageId === id);
    if (instance) {
      if (instance.state === 'enter') {
        instance.state = 'leave';
        this.readyInstances();
        return;
      }

      this.instances.splice(this.instances.indexOf(instance), 1);
      this.instances = [...this.instances];

      this.onRemove(instance, manualClick);
      this.readyInstances();
    }
  }

  public removeAll(): void {
    this.instances.forEach(i => this.onRemove(i));
    this.instances = [];
    this.readyInstances();
  }


  private onCreate(instance: MuiNotificationEntity): Required<MuiNotificationEntity> {
    instance.options = this.mergeOptions(instance.options);
    instance.onClose = new Subject<boolean>();
    return instance as Required<MuiNotificationEntity>;
  }

  private onRemove(instance: MuiNotificationEntity, manualClick = false): void {
    instance.onClose.next(manualClick);
    instance.onClose.complete();
  }


  private replaceNotification(old: MuiNotificationEntity, _new: MuiNotificationEntity): void {
    old.title = _new.title;
    old.content = _new.content;
    old.type = _new.type;
    old.template = _new.template;
    old.options = _new.options;
  }

  private mergeOptions(options?: MuiNotificationEntityOptions): MuiNotificationEntityOptions {
    const {duration, animate, animateTimer, pauseOnHover} = this.config!;
    return {duration, animate, animateTimer, pauseOnHover, closable: true, ...options};
  }
}

