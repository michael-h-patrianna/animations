import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'standard-effects__blink',
  urlSlugFramer: '/standard-effects-framer?animation=standard-effects__blink',
  urlSlugCss: '/standard-effects-css?animation=standard-effects__blink',
  title: 'Blink',
  description:
    'Rapid opacity flash for attention-grabbing notifications and alerts. Wraps any element. Configurable duration.',
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
