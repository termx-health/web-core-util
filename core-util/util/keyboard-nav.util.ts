export function navigateList<T>(e: KeyboardEvent, selected: number, list: T[], selectFn: (selectedItem: T) => void): number {
  if (!list || !['ArrowUp', 'ArrowDown', 'Enter'].includes(e.code)) {
    return selected;
  }
  e.preventDefault();
  e.stopPropagation();
  switch (e.code) {
    case 'ArrowUp':
      if (selected > 0) {
        return selected - 1;
      }
      break;
    case 'ArrowDown':
      if (selected < list.length - 1) {
        return selected + 1;
      }
      break;
    case 'Enter':
      if (list[selected]) {
        selectFn(list[selected])
      }
  }
  return selected;
}
