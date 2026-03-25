import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'standard-effects__float',
  urlSlugFramer: '/standard-effects-framer?animation=standard-effects__float',
  urlSlugCss: '/standard-effects-css?animation=standard-effects__float',
  title: 'Float',
  description:
    'Continuous floating with subtle drift and rotation. Wraps any element. Configurable cycle duration.',
  infinite: true,
  tier: 1,
  props: [
    {
      type: 'number',
      name: 'duration',
      label: 'Duration',
      default: 5000,
      min: 100,
      max: 5000,
      step: 50,
      unit: 'ms',
    },
    {
      type: 'string',
      name: 'children',
      label: 'Children',
      disabled: true,
      disabledReason: 'Pass content via JSX children',
    },
  ],
}
