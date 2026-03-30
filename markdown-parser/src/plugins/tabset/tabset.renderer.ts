import {nextChildren, times} from '../utils';
import {v4 as uuid} from 'uuid';

/**
 * HTML renderer
 */

export default function init(doc: Document, container: HTMLElement): void {
  for (let i = 1; i < 6; i++) {
    Array.from(container.querySelectorAll(`h${i}.tabset`)).forEach((elm: Element) => {
      if (elm.hasAttribute('data-initialized')) {
        return;
      }

      elm.setAttribute("data-initialized", '');
      const elements = [];
      const id = uuid();

      const tabs = nextChildren(elm, times(i, t => `h${t + 1}`).join(","), `h${i + 1}`);
      tabs.forEach((tab, idx) => {
        const contents = nextChildren(tab, times(i + 1, t => `h${t + 1}`).join(","));

        // tab
        elements.push(`
            <input type="radio" name="tabs-${id}" id="tab-${id}-${idx}" ${idx === 0 ? 'checked="true"' : ''}">
            <label class="tab-label" for="tab-${id}-${idx}">
              ${tab.innerHTML}
            </label>
            <div class="tab">
              ${contents.map(c => c.outerHTML).join('\n')}
            </div>
          `);

        // clear content elements
        contents.forEach(c => c.remove());
        tab.remove();
      });


      const tabset = doc.createElement('div');
      tabset.innerHTML = `
          <md-tabs class="tabs" >
            ${elements.join('\n')}
          </md-tabs>
        `;

      elm.after(tabset);
      elm.remove();
    });
  }
};
