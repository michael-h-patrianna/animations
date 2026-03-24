import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'standard-effects__scale',
  urlSlugFramer: '/standard-effects-framer?animation=standard-effects__scale',
  urlSlugCss: '/standard-effects-css?animation=standard-effects__scale',
  title: 'Scale',
  description:
    'Scale-up entrance with organic rotation and skew overshoot. Wraps any element. Configurable duration.',
  tier: 1,
  props: [
    { type: 'number', name: 'duration', label: 'Duration', default: 600, min: 100, max: 5000, step: 50, unit: 'ms' },
    { type: 'string', name: 'children', label: 'Children', disabled: true, disabledReason: 'Pass content via JSX children' },
  ],
}
