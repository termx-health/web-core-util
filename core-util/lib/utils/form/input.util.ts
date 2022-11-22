import {isDefined, isNil} from '../object/object.util';


export function findFocusableElement(el: Element): HTMLElement | undefined {
  if (isNil(el)) {
    return;
  }

  if (el instanceof HTMLElement && el.tabIndex !== -1) {
    return el;
  }
  for (let i = 0; i < el.children.length; i++) {
    const s = findFocusableElement(el.children.item(i)!);
    if (isDefined(s)) {
      return s;
    }
  }
}
