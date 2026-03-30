import {InjectionToken} from '@angular/core';

export const MUI_QUILL_CONFIG = new InjectionToken<MuiQuillConfig>('MUI_QUILL_CONFIG');

export interface MuiQuillConfig {
  toolBarConfig: any;
}

export const DEFAULT_RICH_TEXT_CONFIG: Required<MuiQuillConfig> = {
  toolBarConfig: [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],
    [{'list': 'ordered'}, {'list': 'bullet'}],
    [{'header': [1, 2, 3, 4, 5, 6, false]}],
    [{'font': []}, {'align': []}],
    ['clean']
  ]
};
