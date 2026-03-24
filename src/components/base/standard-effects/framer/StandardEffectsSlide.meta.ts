import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'standard-effects__slide',
  urlSlugFramer: '/standard-effects-framer?animation=standard-effects__slide',
  urlSlugCss: '/standard-effects-css?animation=standard-effects__slide',
  title: 'Slide',
  description:
    'Slide-in from left with scale and rotation for panel entrances. Wraps any element. Configurable duration.',
  tier: 1,
  props: [
    { type: 'number', name: 'duration', label: 'Duration', default: 700, min: 100, max: 5000, step: 50, unit: 'ms' },
    { type: 'string', name: 'children', label: 'Children', disabled: true, disabledReason: 'Pass content via JSX children' },
  ],
}
