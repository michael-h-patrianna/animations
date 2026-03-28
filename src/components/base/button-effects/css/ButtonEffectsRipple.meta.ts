import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'button-effects__ripple',
  title: 'Ripple',
  description:
    'Wraps any element with Material Design-style click ripple. Spawns radial circles at click position. Props: color, duration.',
  disableReplay: true,
  tier: 2,
  tags: [],
  props: [
    { type: 'color', name: 'color', label: 'Ripple Color', default: 'rgb(255 255 255 / 40%)' },
    {
      type: 'number',
      name: 'duration',
      label: 'Duration',
      default: 520,
      min: 100,
      max: 3000,
      step: 10,
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
