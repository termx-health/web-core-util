import {TemplateRef} from '@angular/core';


export type MuiModalPlacement = 'top' | 'left' | 'bottom' | 'right' | 'center';

export interface MuiModalOptions {
  open?: boolean,

  closable?: boolean,
  maskClosable?: boolean,
  animate?: boolean,

  style?: string,
  className?: string,
  placement?: MuiModalPlacement,

  header?: TemplateRef<any>,
  content?: TemplateRef<any>,
  footer?: TemplateRef<any>,
}
