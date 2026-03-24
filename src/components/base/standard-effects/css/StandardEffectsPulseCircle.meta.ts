import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'standard-effects__pulse-circle',
  urlSlugFramer: '/standard-effects-framer?animation=standard-effects__pulse-circle',
  urlSlugCss: '/standard-effects-css?animation=standard-effects__pulse-circle',
  title: 'Pulse Circle',
  description:
    'Self-contained pulsing circle with expanding ring indicators. Configurable size, color, and duration.',
  tier: 1,
  props: [
    { type: 'number', name: 'size', label: 'Size', default: 76, min: 10, max: 200, step: 2, unit: 'px' },
    { type: 'color', name: 'color', label: 'Color', default: '#7a468e' },
    { type: 'color', name: 'ringColor', label: 'Ring Color', default: 'rgb(236 195 255 / 60%)' },
    { type: 'number', name: 'duration', label: 'Duration', default: 2200, min: 100, max: 5000, step: 50, unit: 'ms' },
  ],
}
