import {v4 as uuid} from 'uuid';
import mdAttrs from 'markdown-it-attrs';
import mdEmoji from 'markdown-it-emoji';
import mdTaskLists from 'markdown-it-task-lists';
import mdExpandTabs from 'markdown-it-expand-tabs';
import mdAbbr from 'markdown-it-abbr';
import mdSup from 'markdown-it-sup';
import mdSub from 'markdown-it-sub';
import mdMark from 'markdown-it-mark';
import mdCollapsible from 'markdown-it-collapsible';
import mdMultiTable from 'markdown-it-multimd-table';
import mdPlantuml from './plugins/plantuml/plantuml';
import mdFootnote from './plugins/footnote/footnote';
import prerenderTabs from './plugins/tabset/tabset-pre.renderer';
import renderTabs from './plugins/tabset/tabset.renderer';
import MarkdownIt from 'markdown-it';
import escape from 'escape-html';

export interface MarkdownParserConfig {
  plantUml?: {
    server?: string
  }
}

export interface MarkdownPlugin {
  renderer?: (doc: Document, container: HTMLElement) => Promise<void> | void,
  plugin?: (md, params?) => void
  pluginOptions?: any
}


export class MarkdownParser {
  private _plugins: MarkdownPlugin[] = [];

  private md: MarkdownIt;

  public constructor(
    private DOCUMENT: () => Document,
    private CONTAINER: () => HTMLElement,
    private config: MarkdownParserConfig
  ) {
    this.md = new MarkdownIt()
      .set({
        html: true,
        breaks: true,
        linkify: true,
        typographer: true,
        highlight(str, lang) {
          if (['mermaid', 'plantuml'].includes(lang)) {
            return `<pre class="codeblock-${lang}"><code>${escape(str)}</code></pre>`;
          } else {
            const id = uuid();
            // Bootstrap Icons. MIT License: https://github.com/twbs/icons/blob/main/LICENSE.md
            return `<pre style="position: relative" class="language-${lang}">` +
              `<code class="language-${lang}" id="md-text-${id}">${escape(str)}</code>` +
              `<div class="copy-button" style="position: absolute; top: 1em; right: 1em; cursor: pointer; display: flex; color: var(--color-borders-dark); font-size: 10px" onclick="_mMarkdownCopyText('md-text-${id}')">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-clipboard" viewBox="0 0 16 16">
                  <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1h1a1 1 0 0 1 1 1V14a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V3.5a1 1 0 0 1 1-1h1v-1z"/>
                  <path d="M9.5 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3zm-3-1A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3z"/>
                </svg>

                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-clipboard-check-fill" viewBox="0 0 16 16" hidden>
                  <path d="M6.5 0A1.5 1.5 0 0 0 5 1.5v1A1.5 1.5 0 0 0 6.5 4h3A1.5 1.5 0 0 0 11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3Zm3 1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-3a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h3Z"/>
                  <path d="M4 1.5H3a2 2 0 0 0-2 2V14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V3.5a2 2 0 0 0-2-2h-1v1A2.5 2.5 0 0 1 9.5 5h-3A2.5 2.5 0 0 1 4 2.5v-1Zm6.854 7.354-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 0 1 .708-.708L7.5 10.793l2.646-2.647a.5.5 0 0 1 .708.708Z"/>
                </svg>
              </div>` +
              `</pre>`;
          }
        }
      })
      .use(mdAbbr)
      .use(mdAttrs)
      .use(mdCollapsible)
      .use(mdEmoji)
      .use(mdExpandTabs)
      .use(mdFootnote)
      .use(mdMark)
      .use(mdMultiTable, {multiline: true, rowspan: true, headerless: true})
      .use(mdPlantuml, {server: this.config?.plantUml?.server})
      .use(mdSub)
      .use(mdSup)
      .use(mdTaskLists, {label: false, labelAfter: false});
  }


  /* Plugins */

  public use(plugin: MarkdownPlugin): MarkdownParser {
    if (plugin.plugin) {
      this.md.use(plugin.plugin, plugin.pluginOptions);
    }
    this._plugins.push(plugin);
    return this;
  }


  /* Render */

  public async render(data: string, opts: {prerender?: boolean} = {}): Promise<string> {
    // DOCUMENT reference
    const _document = this.DOCUMENT();
    // HTML ELEMENT reference for pipeline's intermediate HTML storage
    const _container = this.CONTAINER();

    // Rendering Pipeline
    // the actions that must be performed on already rendered HTML
    const _pipeline = [
      (doc: Document, cont: HTMLElement): void => opts.prerender ? prerenderTabs(doc, cont) : renderTabs(doc, cont),
      ...this._plugins.map(p => p.renderer).filter(Boolean)
    ];


    return new Promise(resolve => {
      // sync: markdown-it render
      _container.innerHTML = this.md.render(data);

      // async: HTML element render
      (function _render(i: number = 0): void {
        const fn = _pipeline[i];
        if (fn === undefined) {
          resolve(_container.innerHTML);
          return;
        }

        const r = fn(_document, _container);
        if (r instanceof Promise) {
          r.then(() => _render(++i));
        } else {
          setTimeout(() => _render(++i));
        }
      })();
    });
  }
}
