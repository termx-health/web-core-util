import {InjectionToken} from '@angular/core';
import {MarkdownParserConfig} from '@termx-health/markdown-parser';

export interface MuiMarkdownConfig extends MarkdownParserConfig {

}

export const MUI_MARKDOWN_CONFIG = new InjectionToken<MuiMarkdownConfig>('MUI_MARKDOWN_CONFIG');

