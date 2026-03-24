import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'button-effects__jitter',
  title: 'Button Jitter',
  description:
    'Wraps any element with a looping scale-burst and rotation wobble. Switches to a heartbeat on hover. Props: duration.',
  infinite: true,
  tier: 1,
  props: [
    {
      type: 'number',
      name: 'duration',
      label: 'Duration',
      default: 4000,
      min: 500,
      max: 10000,
      step: 100,
      unit: 'ms',
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
