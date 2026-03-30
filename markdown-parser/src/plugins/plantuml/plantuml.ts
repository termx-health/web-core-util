// https://github.com/gmunguia/markdown-it-plantuml
import {encode64, zip_deflate} from "./deflate";
import {matchSection} from '../utils';

/**
 * markdown-it plugin
 */

export default function umlPlugin(md, options): void {
  options ??= {};

  const openMarker = options.openMarker || '```plantuml';
  const closeMarker = options.closeMarker || '```';
  const render = options.render || md.renderer.rules.image;
  const generateSource = options.generateSource || generateSourceDefault;

  const uml = (state, sl, el, silent) => {
    const {
      failed,
      start,
      end,
      autoClosed,
      markup,
      params,
      content
    } = matchSection(openMarker, closeMarker, state, sl, el, silent);

    if (failed) {
      return false;
    }


    // We generate a token list for the alt property, to mimic what the image parser does.
    let altToken = [];
    // Remove leading space if any.
    let alt = params ? params.slice(1) : 'uml diagram';
    state.md.inline.parse(
      alt,
      state.md,
      state.env,
      altToken
    );

    const token = state.push('uml_diagram', 'img', 0);
    // alt is constructed from children. No point in populating it here.
    token.attrs = [['src', generateSource(content.match(/```plantuml(.*?)```/s)?.[1], options)], ['alt', '']];
    token.block = true;
    token.children = altToken;
    token.info = params;
    token.map = [start.line, end.line];
    token.markup = markup;
    state.line = end.line + (autoClosed ? 1 : 0);

    return true;
  };

  md.block.ruler.before('fence', 'uml_diagram', uml, {
    alt: ['paragraph', 'reference', 'blockquote', 'list']
  });
  md.renderer.rules.uml_diagram = render;
};

function generateSourceDefault(umlCode, opts): string {
  const imageFormat = opts.imageFormat || 'svg';
  const diagramName = opts.diagramName || 'uml';
  const server = opts.server || 'https://www.plantuml.com/plantuml';
  const zippedCode = encode64(zip_deflate('@start' + diagramName + '\n' + umlCode + '\n@end' + diagramName));

  return server + '/' + imageFormat + '/' + zippedCode;
}
