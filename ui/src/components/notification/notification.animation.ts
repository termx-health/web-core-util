import {animate, state, style, transition, trigger} from '@angular/animations';

export const notificationAnimation = trigger('notificationMotion', [
  state('enterTop', style({opacity: 1, transform: 'translateX(0)'})),
  transition('* => enterTop', [style({opacity: 0, transform: 'translateY(50%)'}), animate('100ms linear')]),

  state('enterBottom', style({opacity: 1, transform: 'translateX(0)'})),
  transition('* => enterBottom', [style({opacity: 0, transform: 'translateY(-50%)', height: 0}), animate('100ms linear')]),

  state('enterRight', style({opacity: 1, transform: 'translateX(0)'})),
  transition('* => enterRight', [style({opacity: 0, transform: 'translateX(50%)'}), animate('100ms linear')]),

  state('enterLeft', style({opacity: 1, transform: 'translateX(0)'})),
  transition('* => enterLeft', [style({opacity: 0, transform: 'translateX(-50%)'}), animate('100ms linear')]),


  state(
    'leave',
    style({
      opacity: 0,
      transform: 'scaleY(0.8)',
      transformOrigin: '0% 0%',
      height: 0
    })
  ),
  transition('* => leave', [
    style({
      opacity: 1,
      transform: 'scaleY(1)',
      transformOrigin: '0% 0%'
    }),
    animate('100ms linear')
  ])
]);

