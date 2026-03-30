import mermaid from 'mermaid';

export default function init(el: HTMLElement): Promise<void> {
  return mermaid.run({nodes: el.querySelectorAll('pre.codeblock-mermaid > code')});
};

