import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'loading-states__spinner-dual-ring',
  urlSlugFramer: '/loading-states-framer?animation=loading-states__spinner-dual-ring',
  urlSlugCss: '/loading-states-css?animation=loading-states__spinner-dual-ring',
  title: 'Spinner Dual Ring',
  description:
    'Two concentric rings spinning in opposite directions. Configure size, color, secondaryColor, speed, and thickness.',
  infinite: true,
  tier: 4,
  props: [
    {
      type: 'number',
      name: 'size',
      label: 'Size',
      default: 48,
      min: 20,
      max: 100,
      step: 2,
      unit: 'px',
    },
    { type: 'color', name: 'color', label: 'Color', default: '#ecc3ff' },
    { type: 'color', name: 'secondaryColor', label: 'Secondary Color', default: '#c6ff77' },
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
    {
      type: 'number',
      name: 'thickness',
      label: 'Thickness',
      default: 4,
      min: 1,
      max: 10,
      step: 1,
      unit: 'px',
    },
  ],
} satisfies AnimationMetadata
