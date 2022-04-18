import {ElementRef} from '@angular/core';
import {isDefined, isNil} from '../object/object.util';

export function insertAtCursor(element: HTMLInputElement, text: string): string {
  element.focus();
  const startPos = element.selectionStart;
  const endPos = element.selectionEnd;

  if (startPos || startPos === 0) {
    element.value = element.value.substring(0, startPos) + text + element.value.substring(endPos, element.value.length);
    element.selectionStart = startPos + text.length;
    element.selectionEnd = startPos + text.length;
  } else {
    element.value += text;
  }

  setTimeout(() => element.setSelectionRange(startPos + text.length, startPos + text.length), 0);
  return element.value;
}


export function querySelectorAll(parentElement: ElementRef, selector: string): any[] {
  return Array.prototype.slice.call(parentElement.nativeElement.querySelectorAll(selector));
}

export function findFocusableInput(parentElement: ElementRef, inputName: string): any {
  const nodes = querySelectorAll(parentElement, `[name=${inputName}]`);
  return findFocusableElement(nodes[0]);
}

export function findFocusableElement(el: any): any {
  if (isNil(el)) {
    return null;
  }
  if (el.tabIndex !== -1) {
    return el;
  }
  for (const child of (el.children || [])) {
    const s = findFocusableElement(child);
    if (isDefined(s)) {
      return s;
    }
  }
}
