import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'modal-content__list-vertical-wipe',
  urlSlugFramer: '/modal-content-framer?animation=modal-content__list-vertical-wipe',
  urlSlugCss: '/modal-content-css?animation=modal-content__list-vertical-wipe',
  title: 'List Vertical Wipe',
  description:
    'Horizontal wipe-in stagger. Each child slides from off-screen left inside a clipped container. Props: duration, stagger.',
  tier: 3,
  props: [
    { type: 'number', name: 'duration', label: 'Duration', default: 500, min: 100, max: 2000, step: 50, unit: 'ms' },
    { type: 'number', name: 'stagger', label: 'Stagger', default: 100, min: 0, max: 500, step: 10, unit: 'ms' },
    { type: 'string', name: 'className', label: 'CSS Class', default: '' },
    { type: 'string', name: 'children', label: 'Children', disabled: true, disabledReason: 'Pass content via JSX children' },
    { type: 'string', name: 'style', label: 'Inline Styles', disabled: true, disabledReason: 'CSSProperties object — set in code' },
    { type: 'string', name: 'onAnimationComplete', label: 'On Complete', disabled: true, disabledReason: 'Callback — set in code' },
  ],
}
