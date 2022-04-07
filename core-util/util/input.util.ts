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
