import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'loading-states__pulsating',
  urlSlugFramer: '/loading-states-framer?animation=loading-states__pulsating',
  urlSlugCss: '/loading-states-css?animation=loading-states__pulsating',
  title: 'Pulsating',
  description:
    'Two concentric rings expanding from center and fading. Configure size, color, ringWidth, and speed.',
  infinite: true,
  tier: 4,
  props: [
    {
      type: 'number',
      name: 'size',
      label: 'Size',
      default: 48,
      min: 20,
      max: 120,
      step: 2,
      unit: 'px',
    },
    { type: 'color', name: 'color', label: 'Color', default: '#c47ae5' },
    {
      type: 'number',
      name: 'ringWidth',
      label: 'Ring Width',
      default: 3,
      min: 1,
      max: 10,
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
