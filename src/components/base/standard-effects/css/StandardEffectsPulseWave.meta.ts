import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'standard-effects__pulse-wave',
  urlSlugFramer: '/standard-effects-framer?animation=standard-effects__pulse-wave',
  urlSlugCss: '/standard-effects-css?animation=standard-effects__pulse-wave',
  title: 'Pulse Wave',
  description:
    'Continuous pulsing core with expanding ring wave indicators. Configurable size, color, and duration.',
  infinite: true,
  tier: 1,
  props: [
    {
      type: 'number',
      name: 'size',
      label: 'Size',
      default: 56,
      min: 10,
      max: 200,
      step: 2,
      unit: 'px',
    },
    { type: 'color', name: 'color', label: 'Color', default: '#7a468e' },
    { type: 'color', name: 'ringColor', label: 'Ring Color', default: 'rgb(236 195 255 / 60%)' },
    {
      type: 'number',
      name: 'duration',
      label: 'Duration',
      default: 2000,
      min: 100,
      max: 5000,
      step: 50,
      unit: 'ms',
    },
  ],
}
