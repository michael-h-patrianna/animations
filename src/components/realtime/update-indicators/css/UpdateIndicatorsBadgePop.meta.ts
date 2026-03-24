import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'update-indicators__badge-pop',
  urlSlugFramer: '/update-indicators-framer?animation=update-indicators__badge-pop',
  urlSlugCss: '/update-indicators-css?animation=update-indicators__badge-pop',
  title: 'Badge Pop',
  description:
    'Animated badge that pops in with elastic overshoot. Place next to any element to signal new content. Configure children (badge text), color, duration.',
  tier: 2,
  demoMode: 'status-row',
  props: [
    { type: 'string', name: 'children', label: 'Children', disabled: true, disabledReason: 'ReactNode — set via JSX children' },
    { type: 'color', name: 'color', label: 'Color', default: '#c47ae5' },
    { type: 'number', name: 'duration', label: 'Duration', default: 400, min: 100, max: 1500, step: 50, unit: 'ms' },
  ],
} satisfies AnimationMetadata
