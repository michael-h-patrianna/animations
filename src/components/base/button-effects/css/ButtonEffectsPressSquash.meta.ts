import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'button-effects__press-squash',
  title: 'Press Squash',
  description:
    'Wraps any element with a click-triggered squash-and-stretch anchored at bottom. Props: duration.',
  disableReplay: true,
  tier: 1,
  props: [
    { type: 'number', name: 'duration', label: 'Duration', default: 300, min: 50, max: 2000, step: 50, unit: 'ms' },
    { type: 'string', name: 'children', label: 'Children', disabled: true, disabledReason: 'Wrap your button via JSX children' },
  ],
}
