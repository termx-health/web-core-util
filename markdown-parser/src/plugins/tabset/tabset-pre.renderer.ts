import {nextChildren, times} from '../utils';

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
      elm.innerHTML = 'Tabset (rendered upon saving)';

      const tabs = nextChildren(elm, times(i, t => `h${t + 1}`).join(","), `h${i + 1}`);
      tabs.forEach(tab => {
        // Style tab
        tab.classList.add('tabset-header');

        // Query all elements "inside" of tab
        const content = nextChildren(tab, times(i + 1, t => `h${t + 1}`).join(","));

        // Create content wrapper
        const wrapper = doc.createElement('div');
        wrapper.className = 'tabset-content';
        tab.after(wrapper);

        // Transfer content elements into wrapper
        content.forEach(c => {
          c.remove();
          wrapper.appendChild(c);
        });
      });
    });
  }
};
