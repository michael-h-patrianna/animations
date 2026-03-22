import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'loading-states__ring-multi',
  urlSlugFramer: '/loading-states-framer?animation=loading-states__ring-multi',
  urlSlugCss: '/loading-states-css?animation=loading-states__ring-multi',
  title: 'Multi Ring',
  description:
    'Three concentric rings spinning at different speeds. Configure size, colors, thickness, and speed via CSS custom properties.',
  infinite: true,
  tier: 4,
} satisfies AnimationMetadata
