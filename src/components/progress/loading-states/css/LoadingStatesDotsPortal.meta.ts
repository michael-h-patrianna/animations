import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'loading-states__dots-portal',
  urlSlugFramer: '/loading-states-framer?animation=loading-states__dots-portal',
  urlSlugCss: '/loading-states-css?animation=loading-states__dots-portal',
  title: 'Dots Portal',
  description:
    'Three dots converge to center then expand back. Configure color, dotSize, gap, and speed via CSS custom properties.',
  infinite: true,
  tier: 4,
} satisfies AnimationMetadata
