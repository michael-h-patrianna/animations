import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'button-effects__reward-ready-pulse',
  title: 'Reward Ready Pulse',
  description:
    'Wraps any element with a breathing scale + vertical bob to signal availability. Pauses on hover, compresses on tap. Props: duration, pulseScale, bobDistance.',
  infinite: true,
  tier: 1,
  props: [
    {
      type: 'number',
      name: 'duration',
      label: 'Duration',
      default: 2000,
      min: 500,
      max: 8000,
      step: 100,
      unit: 'ms',
    },
    {
      type: 'number',
      name: 'pulseScale',
      label: 'Pulse Scale',
      default: 1.08,
      min: 1.01,
      max: 1.3,
      step: 0.01,
    },
    {
      type: 'number',
      name: 'bobDistance',
      label: 'Bob Distance',
      default: 4,
      min: 0,
      max: 20,
      step: 1,
      unit: 'px',
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
