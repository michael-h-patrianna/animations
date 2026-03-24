import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'loading-states__spinner-orbital',
  urlSlugFramer: '/loading-states-framer?animation=loading-states__spinner-orbital',
  urlSlugCss: '/loading-states-css?animation=loading-states__spinner-orbital',
  title: 'Spinner Orbital',
  description: 'Glowing satellite orbiting a dashed ring. Configure size, color, and speed.',
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
    { type: 'color', name: 'color', label: 'Color', default: '#c47ae5' },
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
