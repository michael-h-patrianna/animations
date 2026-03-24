import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'button-effects__liquid-morph',
  title: 'Liquid Morph',
  description:
    'Wraps any element with a click-triggered blob-like deformation and border-radius morphing. Props: duration.',
  disableReplay: true,
  tier: 1,
  props: [
    { type: 'number', name: 'duration', label: 'Duration', default: 600, min: 100, max: 3000, step: 50, unit: 'ms' },
    { type: 'string', name: 'children', label: 'Children', disabled: true, disabledReason: 'Wrap your button via JSX children' },
  ],
}
