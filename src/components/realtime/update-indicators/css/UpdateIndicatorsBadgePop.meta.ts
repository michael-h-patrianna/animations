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
} satisfies AnimationMetadata
