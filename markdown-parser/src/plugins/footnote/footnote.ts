import mdFootnote from 'markdown-it-footnote';

/**
 * markdown-it plugin
 */

export default function footnote(md): void {
  mdFootnote(md);

  // removes footnote anchor navigation
  md.renderer.rules.footnote_anchor = () => ``;
  md.renderer.rules.footnote_ref = (tokens, idx, options, env, slf): any => {
    const id = slf.rules.footnote_anchor_name(tokens, idx, options, env, slf);
    const caption = slf.rules.footnote_caption(tokens, idx, options, env, slf);
    let refid = id;
    if (tokens[idx].meta.subId > 0) {
      refid += ':' + tokens[idx].meta.subId;
    }
    return '<sup class="footnote-ref"><a id="fnref' + refid + '">' + caption + '</a></sup>';
  };
};
