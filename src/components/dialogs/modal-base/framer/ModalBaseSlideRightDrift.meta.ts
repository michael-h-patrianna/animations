import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'modal-base__slide-right-drift',
  urlSlugFramer: '/modal-base-framer?animation=modal-base__slide-right-drift',
  urlSlugCss: '/modal-base-css?animation=modal-base__slide-right-drift',
  title: 'Slide Right Drift',
  description:
    'Wrap your modal — drifts in from the left with subtle scale. Props: children, duration, distance.',
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
    {
      type: 'number',
      name: 'distance',
      label: 'Distance',
      default: 68,
      min: 10,
      max: 200,
      step: 5,
      unit: 'px',
    },
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
