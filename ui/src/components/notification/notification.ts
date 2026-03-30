import {TemplateRef} from '@angular/core';
import {Subject} from 'rxjs';
import {MuiAlertType} from '../alert';


export type MuiNotificationType = string | MuiAlertType | 'message' | 'blank';
export type MuiNotificationPlacement = string | 'topLeft' | 'top' | 'topRight' | 'bottomLeft' | 'bottom' | 'bottomRight'


export interface MuiNotificationEntityOptions {
  animate?: boolean;
  animateTimer?: boolean;
  duration?: number;
  pauseOnHover?: boolean;
  placement?: MuiNotificationPlacement;

  closable?: boolean;
  data?: any; // template data
  messageKey?: string; // to replace notification
}

export interface MuiNotificationEntity {
  title?: string | TemplateRef<any>;
  content?: string | TemplateRef<any>;
  type?: MuiNotificationType | string;
  template?: TemplateRef<any>;

  // generated
  messageId?: string;
  createdAt?: Date;
  state?: 'enter' | 'leave';
  onClose?: Subject<boolean>;

  options?: MuiNotificationEntityOptions;
}
