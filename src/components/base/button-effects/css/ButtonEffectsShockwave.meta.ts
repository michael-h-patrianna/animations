import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'button-effects__shockwave',
  title: 'Shockwave',
  description:
    'Wraps any element with concentric rings expanding from click point. Props: ringCount, color, duration.',
  disableReplay: true,
  tier: 2,
  props: [
    { type: 'number', name: 'ringCount', label: 'Ring Count', default: 3, min: 1, max: 8, step: 1 },
    { type: 'color', name: 'color', label: 'Ring Color', default: 'rgb(255 255 255 / 50%)' },
    {
      type: 'number',
      name: 'duration',
      label: 'Duration',
      default: 1000,
      min: 200,
      max: 5000,
      step: 50,
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
