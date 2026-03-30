import {animate, AnimationTriggerMetadata, query, stagger, style, transition, trigger} from '@angular/animations';

const EASE_IN_OUT = 'cubic-bezier(0.645, 0.045, 0.355, 1)';


export const treeCollapseMotion: AnimationTriggerMetadata = trigger('treeCollapseMotion', [
  transition('* => *', [
    query(
      'm-tree-node:leave',
      [
        style({overflow: 'hidden'}),
        stagger(0, [
          animate(`150ms ${EASE_IN_OUT}`, style({height: 0, opacity: 0, 'padding-bottom': 0}))
        ])
      ],
      {
        optional: true
      }
    ),
    query(
      'm-tree-node:enter',
      [
        style({overflow: 'hidden', height: 0, opacity: 0, 'padding-bottom': 0}),
        stagger(0, [
          animate(
            `150ms ${EASE_IN_OUT}`,
            style({overflow: 'hidden', height: '*', opacity: '*', 'padding-bottom': '*'})
          )
        ])
      ],
      {
        optional: true
      }
    )
  ])
]);
