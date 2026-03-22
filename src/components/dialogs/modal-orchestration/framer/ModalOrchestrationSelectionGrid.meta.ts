import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'modal-orchestration__selection-grid',
  urlSlugFramer: '/modal-orchestration-framer?animation=modal-orchestration__selection-grid',
  urlSlugCss: '/modal-orchestration-css?animation=modal-orchestration__selection-grid',
  title: 'Grid Tile Cascade',
  description:
    'Wrap child elements in a grid that cascades them in on mount with a fade-up stagger. Configurable stagger delay, duration, distance, and columns.',
  tier: 3,
  previewMaxWidth: 414,
} satisfies AnimationMetadata
