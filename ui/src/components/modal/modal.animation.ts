import {animate, group, query, state, style, transition, trigger} from '@angular/animations';

export const modalAnimations = trigger('modalPanel', [
  state('open', style({opacity: 1})),
  transition('* => open', [
    group([
      animate('100ms'),
      query('.m-modal-wrapper', [
        style({opacity: 0, transform: 'translateY(-10%)'}),
        animate('150ms ease-out'),
      ])
    ])
  ]),

  state('void, close', style({opacity: 0})),
  transition('* => close', [
    group([
      query('.m-modal-wrapper', [
        animate('100ms ease-out'),
        style({opacity: 0, transform: 'translateY(-5%)'})
      ]),
    ]),
    animate('100ms', style({opacity: 0})),
  ]),
]);
