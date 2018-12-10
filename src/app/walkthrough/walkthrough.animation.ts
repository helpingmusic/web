import { trigger, state, style, transition, animate } from '@angular/animations';

const initialStyles = {
  position: 'absolute',
  'padding-bottom': '120px',
  'max-width': 'calc(100% - 30px)',
  'min-width': 'calc(100% - 30px)'
};

export const walkthroughAnimation = trigger('routerTransition', [
  state('void', style(initialStyles)),
  state('*', style(initialStyles)),

  transition(':enter', [
    style({ left: '100%', opacity: 0 }),
    animate('0.3s ease-in-out', style({ left: '0', opacity: 1 })),
  ]),
  transition(':leave', [
    style({ left: '0', opacity: 1 }),
    animate('0.3s ease-in-out', style({ left: '-100%', opacity: 0 })),
  ]),
]);

