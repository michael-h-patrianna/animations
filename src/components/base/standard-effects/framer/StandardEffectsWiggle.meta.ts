import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'standard-effects__wiggle',
  urlSlugFramer: '/standard-effects-framer?animation=standard-effects__wiggle',
  urlSlugCss: '/standard-effects-css?animation=standard-effects__wiggle',
  title: 'Wiggle',
  description:
    'Rotation oscillation with scale breathing and position drift for attention. Wraps any element. Configurable duration.',
  tier: 1,
  props: [
    {
      type: 'number',
      name: 'duration',
      label: 'Duration',
      default: 1000,
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
