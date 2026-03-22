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
} satisfies AnimationMetadata
