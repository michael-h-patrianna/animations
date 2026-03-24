import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'modal-base__scale-gentle-pop',
  urlSlugFramer: '/modal-base-framer?animation=modal-base__scale-gentle-pop',
  urlSlugCss: '/modal-base-css?animation=modal-base__scale-gentle-pop',
  title: 'Gentle Scale Pop',
  description:
    'Wrap your modal content — scales from 85% with fade-in overlay. Props: children, duration.',
  tier: 2,
  props: [
    {
      type: 'number',
      name: 'duration',
      label: 'Duration',
      default: 420,
      min: 100,
      max: 2000,
      step: 50,
      unit: 'ms',
    },
    { type: 'string', name: 'className', label: 'CSS Class', default: '' },
    {
      type: 'string',
      name: 'children',
      label: 'Children',
      disabled: true,
      disabledReason: 'Pass content via JSX children',
    },
    {
      type: 'string',
      name: 'style',
      label: 'Inline Styles',
      disabled: true,
      disabledReason: 'CSSProperties object — set in code',
    },
    {
      type: 'string',
      name: 'onAnimationComplete',
      label: 'On Complete',
      disabled: true,
      disabledReason: 'Callback — set in code',
    },
  ],
}
