import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'loading-states__dots-rise',
  urlSlugFramer: '/loading-states-framer?animation=loading-states__dots-rise',
  urlSlugCss: '/loading-states-css?animation=loading-states__dots-rise',
  title: 'Dots Rise',
  description: 'Three dots bouncing upward in sequence. Configure color, dotSize, gap, and speed.',
  infinite: true,
  tier: 4,
  props: [
    { type: 'color', name: 'color', label: 'Color', default: '#c47ae5' },
    {
      type: 'number',
      name: 'dotSize',
      label: 'Dot Size',
      default: 12,
      min: 4,
      max: 40,
      step: 1,
      unit: 'px',
    },
    { type: 'number', name: 'gap', label: 'Gap', default: 8, min: 0, max: 40, step: 1, unit: 'px' },
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
