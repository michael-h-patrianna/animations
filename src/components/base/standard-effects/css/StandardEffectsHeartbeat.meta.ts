import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'standard-effects__heartbeat',
  urlSlugFramer: '/standard-effects-framer?animation=standard-effects__heartbeat',
  urlSlugCss: '/standard-effects-css?animation=standard-effects__heartbeat',
  title: 'HeartBeat',
  description:
    'Rhythmic double-beat pulse for likes and favorite interactions. Wraps any element. Configurable cycle duration.',
  infinite: true,
  tier: 1,
  props: [
    {
      type: 'number',
      name: 'duration',
      label: 'Duration',
      default: 1300,
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
