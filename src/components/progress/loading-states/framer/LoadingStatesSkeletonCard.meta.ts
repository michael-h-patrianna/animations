import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'loading-states__skeleton-card',
  urlSlugFramer: '/loading-states-framer?animation=loading-states__skeleton-card',
  urlSlugCss: '/loading-states-css?animation=loading-states__skeleton-card',
  title: 'Skeleton Card',
  description:
    'Card skeleton composed from Skeleton primitives. Use SharedSkeleton.tsx (framer) or .pf-skeleton class (CSS) for custom layouts.',
  infinite: true,
  tier: 4,
} satisfies AnimationMetadata
