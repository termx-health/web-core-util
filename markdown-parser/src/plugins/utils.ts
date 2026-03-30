export const times = (times: number, fn: (idx) => any): any[] => {
  return new Array(times).fill(1).map((_, idx) => fn(idx));
};

export const nextChildren = (root: Element, until: string, filter?: string): Element[] => {
  const res = [];
  while (root) {
    root = root.nextElementSibling;
    if (!root) {
      break;
    }

    if (until.includes(root.localName)) {
      break;
    }
    if (!filter || filter.includes(root.localName)) {
      res.push(root);
    }
  }
  return res;
};

export function matchSection(openMarker, closeMarker, state, startLine, endLine, silent) {
  let nextLine;
  let autoClosed;
  let i;
  let markup;
  let params;
  let start = state.bMarks[startLine] + state.tShift[startLine];
  let end = state.eMarks[startLine];

  const res = (success) => ({
    failed: !success,

    start: {index: start, line: startLine},
    end: {index: end, line: nextLine},
    autoClosed,

    markup,
    params,
    content: state.src.split('\n').slice(startLine, nextLine + 1).join('\n')
  });


  // Check out the first character quickly,
  // this should filter out most of non-uml blocks
  if (openMarker.charCodeAt(0) !== state.src.charCodeAt(start)) {
    return res(false);
  }

  // Check out the rest of the marker string
  for (i = 0; i < openMarker.length; ++i) {
    if (openMarker[i] !== state.src[start + i]) {
      return res(false);
    }
  }

  markup = state.src.slice(start, start + i);
  params = state.src.slice(start + i, end);

  // Since start is found, we can report success here in validation mode
  if (silent) {
    return res(true);
  }

  // Search for the end of the block
  nextLine = startLine;

  if (params.includes(closeMarker)) {
    autoClosed = true;
    return res(true);
  }

  for (; ;) {
    nextLine++;
    if (nextLine >= endLine) {
      // unclosed block should be autoclosed by end of document.
      // also block seems to be autoclosed by end of parent
      break;
    }

    start = state.bMarks[nextLine] + state.tShift[nextLine];
    end = state.eMarks[nextLine];

    if (start < end && state.sCount[nextLine] < state.blkIndent) {
      // non-empty line with negative indent should stop the list:
      // - ```
      //  test
      break;
    }

    if (closeMarker.charCodeAt(0) !== state.src.charCodeAt(start)) {
      // didn't find the closing fence
      continue;
    }

    if (state.sCount[nextLine] > state.sCount[startLine]) {
      // closing fence should not be indented with respect of opening fence
      continue;
    }

    let closeMarkerMatched = true;
    for (i = 0; i < closeMarker.length; ++i) {
      if (closeMarker[i] !== state.src[start + i]) {
        closeMarkerMatched = false;
        break;
      }
    }

    if (!closeMarkerMatched) {
      continue;
    }

    // make sure tail has spaces only
    if (state.skipSpaces(start + i) < end) {
      continue;
    }

    // found!
    autoClosed = true;
    break;
  }

  return res(true);
};
