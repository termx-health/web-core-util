import {Injectable} from '@angular/core';

export class PrintOptions {
  public css?: string;
  public size?: 'A5 landscape' | string;
}

@Injectable({providedIn: 'root'})
export class PrintService {

  public printHtml(content: string, opts: PrintOptions = new PrintOptions()): void {
    const iframe = document.createElement('iframe');
    document.getElementsByTagName('body')[0].append(iframe);
    let html;
    if (content.startsWith('<html')) {
      html = content;
    } else {
      html = `<head><style type="text/css">${this.getCss(opts)}</style></head>`;
      html += '<body>' + content + '</body>';
    }
    iframe.contentWindow.document.write(html);
    iframe.contentWindow.document.close();
    iframe.contentWindow.focus();
    iframe.contentWindow.print();
    setTimeout(() => iframe.remove());
  }

  private getCss(opts: PrintOptions): string {
    return `
      ${opts.size ? `@page { size: ${opts.size}; margin: 0;}` : ''};
      body {-webkit-print-color-adjust: exact; color-adjust: exact;}
      ${opts.css}
    `;
  }
}

