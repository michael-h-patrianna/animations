import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'modal-base__spring-bounce',
  urlSlugFramer: '/modal-base-framer?animation=modal-base__spring-bounce',
  urlSlugCss: '/modal-base-css?animation=modal-base__spring-bounce',
  title: 'Spring Bounce',
  description:
    'Wrap your modal — spring-physics bounce with overshoot. Props: children, stiffness, damping, mass.',
  tier: 2,
  props: [
    { type: 'number', name: 'stiffness', label: 'Stiffness', default: 280, min: 50, max: 800, step: 10 },
    { type: 'number', name: 'damping', label: 'Damping', default: 20, min: 5, max: 60, step: 1 },
    { type: 'number', name: 'mass', label: 'Mass', default: 0.8, min: 0.1, max: 3, step: 0.1 },
    { type: 'string', name: 'className', label: 'CSS Class', default: '' },
    { type: 'string', name: 'children', label: 'Children', disabled: true, disabledReason: 'Pass content via JSX children' },
    { type: 'string', name: 'style', label: 'Inline Styles', disabled: true, disabledReason: 'CSSProperties object — set in code' },
    { type: 'string', name: 'onAnimationComplete', label: 'On Complete', disabled: true, disabledReason: 'Callback — set in code' },
  ],
}
