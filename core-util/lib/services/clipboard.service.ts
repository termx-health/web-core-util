import {Inject, Injectable} from '@angular/core';
import {DOCUMENT} from '@angular/common';

@Injectable({providedIn: 'root'})
export class ClipboardService {
  private window: Window;

  public constructor(@Inject(DOCUMENT) public document: Document) {
    this.window = document.defaultView as Window;
  }

  // todo: fix deprecated methods & check browser support/platform

  public copy(content: string): void {
    this.copyFromContent(content);
  }

  private copyFromContent(content: string, container: HTMLElement = this.document.body): void {
    const tempTextArea = ClipboardService.createTextArea(this.document, this.window);
    try {
      container.appendChild(tempTextArea);
    } catch (error) {
      throw new Error('Container should be a Dom element');
    }

    // set value
    tempTextArea.value = content;
    tempTextArea.select();
    tempTextArea.setSelectionRange(0, tempTextArea.value.length);

    // copy value
    this.document.execCommand('copy');

    // restore state
    tempTextArea.focus();
    this.window.getSelection()?.removeAllRanges();
    container.removeChild(tempTextArea);
  }

  private static createTextArea(doc: Document, window: Window): HTMLTextAreaElement {
    const ta: HTMLTextAreaElement = doc.createElement('textarea');
    ta.style.fontSize = '12pt';

    ta.style.border = '0';
    ta.style.padding = '0';
    ta.style.margin = '0';

    ta.style.position = 'absolute';
    ta.style.left = '-9999px';

    const yPosition = window.pageYOffset || doc.documentElement.scrollTop;
    ta.style.top = yPosition + 'px';
    ta.setAttribute('readonly', '');
    return ta;
  }
}
