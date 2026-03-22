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
} satisfies AnimationMetadata
