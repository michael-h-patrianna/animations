import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'modal-content-choreography__list-spotlight',
  urlSlugFramer:
    '/modal-content-choreography-framer?animation=modal-content-choreography__list-spotlight',
  urlSlugCss:
    '/modal-content-choreography-css?animation=modal-content-choreography__list-spotlight',
  title: 'List Spotlight Sweep',
  description:
    'Scale-up spotlight stagger. Each child scales from 95% with overshoot, drawing attention sequentially. Props: duration, stagger.',
  tier: 3,
  props: [
    {
      type: 'number',
      name: 'duration',
      label: 'Duration',
      default: 500,
      min: 100,
      max: 2000,
      step: 50,
      unit: 'ms',
    },
    {
      type: 'number',
      name: 'stagger',
      label: 'Stagger',
      default: 120,
      min: 0,
      max: 500,
      step: 10,
      unit: 'ms',
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
