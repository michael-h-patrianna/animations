import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'text-effects__verb-falling',
  urlSlugFramer: '/text-effects-framer?animation=text-effects__verb-falling',
  urlSlugCss: '/text-effects-css?animation=text-effects__verb-falling',
  title: 'Falling',
  description: 'Letters drop and settle with a soft bounce.',
  disableReplay: false,
  tier: 3,
  props: [
    { type: 'string', name: 'text', label: 'Text', default: 'LOREM IPSUM DOLOR' },
    { type: 'number', name: 'stepDelay', label: 'Step Delay', default: 0.05, min: 0.01, max: 0.2, step: 0.01, unit: 's' },
    { type: 'color', name: 'color', label: 'Color', default: '#e8e4da' },
  ],
}
