import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'loading-states__ring-progress',
  urlSlugFramer: '/loading-states-framer?animation=loading-states__ring-progress',
  urlSlugCss: '/loading-states-css?animation=loading-states__ring-progress',
  title: 'Ring Progress',
  description:
    'SVG ring that continuously fills and empties. Configure size, color, trackColor, thickness, and speed.',
  infinite: true,
  tier: 4,
  props: [
    {
      type: 'number',
      name: 'size',
      label: 'Size',
      default: 60,
      min: 20,
      max: 120,
      step: 2,
      unit: 'px',
    },
    { type: 'color', name: 'color', label: 'Color', default: '#c47ae5' },
    { type: 'color', name: 'trackColor', label: 'Track Color' },
    {
      type: 'number',
      name: 'thickness',
      label: 'Thickness',
      default: 4,
      min: 1,
      max: 12,
      step: 1,
      unit: 'px',
    },
    {
      type: 'number',
      name: 'speed',
      label: 'Speed',
      default: 1,
      min: 0.1,
      max: 5,
      step: 0.1,
      unit: 'x',
    },
  ],
} satisfies AnimationMetadata
