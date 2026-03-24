import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'update-indicators__live-ping',
  urlSlugFramer: '/update-indicators-framer?animation=update-indicators__live-ping',
  urlSlugCss: '/update-indicators-css?animation=update-indicators__live-ping',
  title: 'Live Ping',
  description:
    'Continuously pulsing dot to indicate live or real-time status. Configure color, size, duration.',
  infinite: true,
  tier: 2,
  demoMode: 'status-row',
  props: [
    { type: 'color', name: 'color', label: 'Color', default: '#c6ff77' },
    {
      type: 'number',
      name: 'size',
      label: 'Size',
      default: 12,
      min: 6,
      max: 32,
      step: 1,
      unit: 'px',
    },
    {
      type: 'number',
      name: 'duration',
      label: 'Duration',
      default: 1200,
      min: 300,
      max: 3000,
      step: 100,
      unit: 'ms',
    },
  ],
} satisfies AnimationMetadata
