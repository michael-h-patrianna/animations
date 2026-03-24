import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'loading-states__spinner-galaxy',
  urlSlugFramer: '/loading-states-framer?animation=loading-states__spinner-galaxy',
  urlSlugCss: '/loading-states-css?animation=loading-states__spinner-galaxy',
  title: 'Spinner Galaxy',
  description:
    'Spinning disc with two pulsing star dots. Configure size, color, starColors, and speed.',
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
      type: 'colors',
      name: 'starColors',
      label: 'Star Colors',
      default: ['#c6ff77', '#47fff4'],
      maxItems: 2,
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
    { type: 'string', name: 'className', label: 'Class Name' },
  ],
} satisfies AnimationMetadata
