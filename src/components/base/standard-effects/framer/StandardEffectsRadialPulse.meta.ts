import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'standard-effects__radial-pulse',
  urlSlugFramer: '/standard-effects-framer?animation=standard-effects__radial-pulse',
  urlSlugCss: '/standard-effects-css?animation=standard-effects__radial-pulse',
  title: 'Radial Pulse',
  description:
    'Expanding ring ripples from center dot. Configurable ring count, color, and duration.',
  tier: 1,
  props: [
    { type: 'number', name: 'ringCount', label: 'Ring Count', default: 3, min: 1, max: 10, step: 1 },
    { type: 'color', name: 'color', label: 'Ring Color', default: 'rgb(236 195 255 / 32%)' },
    { type: 'color', name: 'dotColor', label: 'Dot Color', default: '#efd7fa' },
    { type: 'number', name: 'duration', label: 'Duration', default: 2400, min: 100, max: 5000, step: 50, unit: 'ms' },
  ],
}
