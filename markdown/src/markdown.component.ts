import {AfterViewInit, Component, ElementRef, inject, Input, OnChanges, SimpleChanges, ViewChild, ViewEncapsulation} from '@angular/core';

import {DomSanitizer, SafeHtml} from '@angular/platform-browser';
import {BooleanInput, isDefined, isNil} from '@termx-health/core-util';
import {MUI_MARKDOWN_CONFIG, MuiMarkdownConfig} from './markdown.options';
import {MarkdownParser} from '@termx-health/markdown-parser';
import renderMermaid from './rendering/mermaid/mermaid.renderer';

@Component({
  standalone: false,
  selector: 'm-markdown',
  templateUrl: 'markdown.component.html',
  encapsulation: ViewEncapsulation.None
})
export class MuiMarkdownComponent implements OnChanges, AfterViewInit {
  public static ngAcceptInputType_mPrerender: boolean | string;
  private readonly config: MuiMarkdownConfig = inject(MUI_MARKDOWN_CONFIG, {optional: true});

  @Input() public mData: string;
  @Input() public mPlugins: ((md, params?) => void)[];
  @Input() public mPluginOptions: {[k: string]: any};
  @Input() @BooleanInput() public mPrerender: boolean;

  protected _parser: MarkdownParser;
  protected _html: SafeHtml;
  @ViewChild('ref') private ref: ElementRef<HTMLDivElement>;

  public constructor(private sanitizer: DomSanitizer) {
    this._parser = new MarkdownParser(() => document, () => this.ref?.nativeElement, this.config)
      .use({renderer: (_, container) => renderMermaid(container)})
      .use({renderer: (_, container) => window['Prism']?.highlightAllUnder(container)});

    window['_mMarkdownCopyText'] = (id): void => {
      const contentEl = document.getElementById(id);
      const copyBtn = contentEl.parentElement.getElementsByClassName('copy-button')[0];

      // Insert CONTENT into TEXT FIELD
      const tf = document.createElement("textarea");
      tf.value = contentEl.textContent;
      document.body.appendChild(tf);

      // Select the CONTENT inside of TEXT FIELD
      tf.select();
      tf.setSelectionRange(0, 100_000); // For mobile devices

      // Copy the CONTENT inside of TEXT FIELD
      navigator.clipboard.writeText(tf.value);

      // Remove created TEXT FIELD
      document.body.removeChild(tf);

      // Toggle copy icon state
      const [first, second] = Array.from(copyBtn.children);
      first.setAttribute('hidden', 'true');
      second.removeAttribute('hidden');

      setTimeout(() => {
        first.removeAttribute('hidden');
        second.setAttribute('hidden', 'true');
      }, 1000);
    };
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes['mPlugins']) {
      const pluginOptions = {...this.config, ...this.mPluginOptions};
      this.mPlugins.forEach(plugin => this._parser.use({
        plugin,
        pluginOptions
      }));
    }

    this.render();
  }

  public ngAfterViewInit(): void {
    if (isDefined(this.mData)) {
      this.render();
    }
  }


  /* Render */

  private render(): void {
    if (isNil(this.ref)) {
      return;
    }

    this._parser.render(this.mData, {prerender: this.mPrerender}).then(html => {
      this._html = this.sanitizer.bypassSecurityTrustHtml(html);
    });
  }
}
