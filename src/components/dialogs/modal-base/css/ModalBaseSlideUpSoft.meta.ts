import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'modal-base__slide-up-soft',
  urlSlugFramer: '/modal-base-framer?animation=modal-base__slide-up-soft',
  urlSlugCss: '/modal-base-css?animation=modal-base__slide-up-soft',
  title: 'Slide Up Soft',
  description:
    'Wrap your modal — slides up from below with subtle scale. Props: children, duration, distance.',
  tier: 2,
  props: [
    { type: 'number', name: 'duration', label: 'Duration', default: 420, min: 100, max: 2000, step: 50, unit: 'ms' },
    { type: 'number', name: 'distance', label: 'Distance', default: 64, min: 10, max: 200, step: 5, unit: 'px' },
    { type: 'string', name: 'className', label: 'CSS Class', default: '' },
    { type: 'string', name: 'children', label: 'Children', disabled: true, disabledReason: 'Pass content via JSX children' },
    { type: 'string', name: 'style', label: 'Inline Styles', disabled: true, disabledReason: 'CSSProperties object — set in code' },
    { type: 'string', name: 'onAnimationComplete', label: 'On Complete', disabled: true, disabledReason: 'Callback — set in code' },
  ],
}
