import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'update-indicators__badge-pulse',
  urlSlugFramer: '/update-indicators-framer?animation=update-indicators__badge-pulse',
  urlSlugCss: '/update-indicators-css?animation=update-indicators__badge-pulse',
  title: 'Badge Pulse',
  description:
    'Animated badge with continuous glow pulse to signal unseen content. Configure children (badge text), color, glowColor, duration.',
  infinite: true,
  tier: 2,
  demoMode: 'status-row',
  props: [
    {
      type: 'string',
      name: 'children',
      label: 'Children',
      disabled: true,
      disabledReason: 'ReactNode — set via JSX children',
    },
    { type: 'color', name: 'color', label: 'Color', default: '#c47ae5' },
    { type: 'color', name: 'glowColor', label: 'Glow Color', default: 'rgb(236 195 255 / 40%)' },
    {
      type: 'number',
      name: 'duration',
      label: 'Duration',
      default: 1000,
      min: 300,
      max: 3000,
      step: 100,
      unit: 'ms',
    },
  ],
} satisfies AnimationMetadata
