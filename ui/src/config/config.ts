import {InjectionToken} from '@angular/core';
import {MuiCardDisplay} from '../components/card/card.component';
import {MultiLanguageInputLanguage} from '../components/inputs/public-api';
import {MuiModalOptions} from '../components/modal/modal';
import {MuiNotificationEntityOptions, MuiNotificationPlacement} from '../components/notification/notification';


export const MUI_CONFIG = new InjectionToken<MuiConfig>('MUI_CONFIG');
export type MuiConfigKey = keyof MuiConfig;


export interface MuiConfig {
  multiLanguageInput?: MuiMultiLanguageInputConfig;
  notifications?: MuiNotificationConfig;
  modal?: MuiModalConfig;
  card?: MuiCardConfig;
  table?: MuiTableConfig;
  httpErrorHandler?: MuiHttpErrorHandlerConfig;
  systemLanguages?: MuiSystemLangConfig;
}


// MultiLanguageInput
export interface MuiMultiLanguageInputConfig {
  languages: MultiLanguageInputLanguage[],
  requiredLanguages: string[],
}

export const DEFAULT_MULTI_LANGUAGE_INPUT_CONFIG: Required<MuiMultiLanguageInputConfig> = {
  languages: [],
  requiredLanguages: []
};


// Notifications
export interface MuiNotificationConfig extends Omit<MuiNotificationEntityOptions, 'data' | 'closable' | 'messageKey'> {
  top?: string | number;
  bottom?: string | number;
  left?: string | number;
  right?: string | number;
}

export const DEFAULT_NOTIFICATION_CONFIG: Required<MuiNotificationConfig> = {
  top: '1em',
  bottom: '1em',
  left: '1em',
  right: '1em',
  placement: 'topRight',
  duration: 5000,
  pauseOnHover: true,
  animate: true,
  animateTimer: true
};

// Modal
export interface MuiModalConfig extends Pick<MuiModalOptions, 'animate' | 'closable' | 'maskClosable' | 'placement'> {
}

export const DEFAULT_MODAL_CONFIG: Required<MuiModalConfig> = {
  closable: true,
  maskClosable: true,
  animate: true,
  placement: 'center'
};


// Card
export interface MuiCardConfig {
  display?: MuiCardDisplay;
}

export const DEFAULT_CARD_CONFIG: Required<MuiCardConfig> = {
  display: 'raised'
};


// Table
export interface MuiTableConfig {
  bordered?: boolean;
  outlined?: boolean;
  rounded?: boolean;
  showTotal?: boolean;
  showPageSizeChanger?: boolean;
  pageSizeOptions?: number[];
}

export const DEFAULT_TABLE_CONFIG: Required<MuiTableConfig> = {
  bordered: false,
  outlined: true,
  rounded: true,
  showTotal: true,
  showPageSizeChanger: false,
  pageSizeOptions: [10, 20, 50]
};


// System supported langs
export type MuiSystemLangConfig = {
  [key: string]: {
    label: string,
  }
}

export const DEFAULT_SYSTEM_LANGS: Required<MuiSystemLangConfig> = {
  en: {label: 'English'}
};


// Http error handler
export interface MuiHttpErrorHandlerConfig {
  duration?: number;
  placement?: MuiNotificationPlacement;
  translationPrefix?: string;
}

export const DEFAULT_HTTP_ERROR_HANDLER_CONFIG: Required<MuiHttpErrorHandlerConfig> = {
  duration: 20_000,
  placement: 'topRight',
  translationPrefix: ""
};


// Default configuration
export const MUI_DEFAULT_CONFIG: Required<MuiConfig> = {
  multiLanguageInput: DEFAULT_MULTI_LANGUAGE_INPUT_CONFIG,
  notifications: DEFAULT_NOTIFICATION_CONFIG,
  modal: DEFAULT_MODAL_CONFIG,
  card: DEFAULT_CARD_CONFIG,
  table: DEFAULT_TABLE_CONFIG,
  systemLanguages: DEFAULT_SYSTEM_LANGS,
  httpErrorHandler: DEFAULT_HTTP_ERROR_HANDLER_CONFIG
};
