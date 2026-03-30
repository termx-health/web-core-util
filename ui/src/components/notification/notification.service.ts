import {Injectable, TemplateRef} from '@angular/core';
import {MuiNotificationContainerComponent} from './notification-container.component';
import {MuiNotificationEntity, MuiNotificationEntityOptions} from './notification';
import {MuiNotificationOverlayService} from './notification-overlay.service';

@Injectable()
export class MuiNotificationService {
  protected componentPrefix: string = 'mui-notifications';

  public constructor(private overlayService: MuiNotificationOverlayService) { }

  public success(title: string | TemplateRef<any>, content?: string | TemplateRef<any>, options?: MuiNotificationEntityOptions): MuiNotificationEntity {
    return this.createNotification({title, content, type: 'success'}, options);
  }

  public info(title: string | TemplateRef<any>, content?: string | TemplateRef<any>, options?: MuiNotificationEntityOptions): MuiNotificationEntity {
    return this.createNotification({title, content, type: 'info'}, options);
  }

  public warning(title: string | TemplateRef<any>, content?: string | TemplateRef<any>, options?: MuiNotificationEntityOptions): MuiNotificationEntity {
    return this.createNotification({title, content, type: 'warning'}, options);
  }

  public error(title: string | TemplateRef<any>, content?: string | TemplateRef<any>, options?: MuiNotificationEntityOptions): MuiNotificationEntity {
    return this.createNotification({title, content, type: 'error'}, options);
  }

  public blank(title: string | TemplateRef<any>, content?: string | TemplateRef<any>, options?: MuiNotificationEntityOptions): MuiNotificationEntity {
    return this.createNotification({title, content, type: 'blank'}, options);
  }

  public template(template: TemplateRef<any>, options?: MuiNotificationEntityOptions): MuiNotificationEntity {
    return this.createNotification({template}, options);
  }

  public message(content: string | TemplateRef<any>, options?: MuiNotificationEntityOptions): string {
    return this.createNotification({content, type: 'message'}, {...options, duration: 0}).messageId;
  }

  public remove(id?: string): void {
    if (this.container) {
      if (id) {
        this.container.remove(id);
      } else {
        this.container.removeAll();
      }
    }
  }


  private createNotification(message: MuiNotificationEntity, options?: MuiNotificationEntityOptions): MuiNotificationEntity {
    return this.container.create({
      ...message,
      createdAt: new Date(),
      messageId: this.overlayService.getGlobalId(this.componentPrefix),
      options: {
        ...options,
        data: {$implicit: options?.data, data: options?.data}
      }
    });
  }

  private get container(): MuiNotificationContainerComponent {
    return this.overlayService.withContainer(this.componentPrefix, MuiNotificationContainerComponent);
  }
}


