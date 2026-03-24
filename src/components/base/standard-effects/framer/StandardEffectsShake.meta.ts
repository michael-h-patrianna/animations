import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'standard-effects__shake',
  urlSlugFramer: '/standard-effects-framer?animation=standard-effects__shake',
  urlSlugCss: '/standard-effects-css?animation=standard-effects__shake',
  title: 'Shake',
  description:
    'Horizontal shake with rotation wobble and scale compression for error feedback. Wraps any element. Configurable duration.',
  tier: 1,
  props: [
    {
      type: 'number',
      name: 'duration',
      label: 'Duration',
      default: 500,
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
