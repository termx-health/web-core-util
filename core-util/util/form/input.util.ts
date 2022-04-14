import {ElementRef} from '@angular/core';

export function insertAtCursor(element: any, text: string): string {
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


export function querySelectorAll(selector: string, elementRef: ElementRef): any[] {
  return Array.prototype.slice.call(elementRef.nativeElement.querySelectorAll(selector));
}

export function findFocusableInput(inputName: string, elementRef: ElementRef): any {
  const nodes = querySelectorAll(`[name=${inputName}]`, elementRef);
  return findFocusableElement(nodes[0]);
}

export function findFocusableElement(el: any): any {
  if (!el) {
    return null;
  }
  if (el.tabIndex !== -1) {
    return el;
  }
  for (const child of (el.children || [])) {
    const s = findFocusableElement(child);
    if (!!s) {
      return s;
    }
  }
}

export function focusNext(rootElement: any = document): any {
  const elements = [...(rootElement.querySelectorAll('input,select') as any)].filter(a => a.tabIndex !== -1);
  const idx = elements.indexOf(document.activeElement);
  if (idx === -1 || !elements[idx + 1]) {
    return;
  }
  elements[idx + 1].focus();
}
