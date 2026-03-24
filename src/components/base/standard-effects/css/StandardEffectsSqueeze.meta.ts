import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'standard-effects__squeeze',
  urlSlugFramer: '/standard-effects-framer?animation=standard-effects__squeeze',
  urlSlugCss: '/standard-effects-css?animation=standard-effects__squeeze',
  title: 'Squeeze',
  description:
    'Compression effect that squashes element for tactile button feedback. Wraps any element. Configurable duration.',
  tier: 1,
  props: [
    { type: 'number', name: 'duration', label: 'Duration', default: 900, min: 100, max: 5000, step: 50, unit: 'ms' },
    { type: 'string', name: 'children', label: 'Children', disabled: true, disabledReason: 'Pass content via JSX children' },
  ],
}
