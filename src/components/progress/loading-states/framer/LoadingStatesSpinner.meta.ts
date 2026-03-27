import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'loading-states__spinner',
  urlSlugFramer: '/loading-states-framer?animation=loading-states__spinner',
  urlSlugCss: '/loading-states-css?animation=loading-states__spinner',
  title: 'Spinner',
  description:
    'Colored arc spinning continuously. Configure size, color, thickness, and speed.',
  infinite: true,
  tier: 4,
  props: [
    {
      type: 'number',
      name: 'size',
      label: 'Size',
      default: 40,
      min: 16,
      max: 100,
      step: 2,
      unit: 'px',
    },
    { type: 'color', name: 'color', label: 'Color', default: '#c47ae5' },
    {
      type: 'number',
      name: 'thickness',
      label: 'Thickness',
      default: 4,
      min: 1,
      max: 16,
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
