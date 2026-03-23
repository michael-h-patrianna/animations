import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'loading-states__ring-progress',
  urlSlugFramer: '/loading-states-framer?animation=loading-states__ring-progress',
  urlSlugCss: '/loading-states-css?animation=loading-states__ring-progress',
  title: 'Ring Progress',
  description:
    'SVG ring that continuously fills and empties. Configure size, color, trackColor, thickness, and speed.',
  infinite: true,
  tier: 4,
} satisfies AnimationMetadata
