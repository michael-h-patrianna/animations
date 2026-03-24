import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'standard-effects__bounce',
  urlSlugFramer: '/standard-effects-framer?animation=standard-effects__bounce',
  urlSlugCss: '/standard-effects-css?animation=standard-effects__bounce',
  title: 'Bounce',
  description:
    'Vertical bounce with squash-stretch deformation and tilt for playful feedback. Wraps any element. Configurable duration.',
  tier: 1,
  props: [
    { type: 'number', name: 'duration', label: 'Duration', default: 800, min: 100, max: 5000, step: 50, unit: 'ms' },
    { type: 'string', name: 'children', label: 'Children', disabled: true, disabledReason: 'Pass content via JSX children' },
  ],
}
