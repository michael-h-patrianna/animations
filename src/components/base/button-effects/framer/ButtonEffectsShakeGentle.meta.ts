import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'button-effects__shake-gentle',
  title: 'Shake Gentle',
  description:
    'Wraps any element with a horizontal shake + opacity dim for error feedback. Props: duration, trigger (programmatic false→true edge).',
  tier: 1,
  props: [
    {
      type: 'number',
      name: 'duration',
      label: 'Duration',
      default: 400,
      min: 100,
      max: 2000,
      step: 50,
      unit: 'ms',
    },
    {
      type: 'string',
      name: 'trigger',
      label: 'Trigger',
      disabled: true,
      disabledReason: 'Pass boolean via trigger prop for programmatic activation',
    },
    {
      type: 'string',
      name: 'children',
      label: 'Children',
      disabled: true,
      disabledReason: 'Wrap your button via JSX children',
    },
  ],
}
