import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'modal-orchestration__flip-reveal',
  urlSlugFramer: '/modal-orchestration-framer?animation=modal-orchestration__flip-reveal',
  urlSlugCss: '/modal-orchestration-css?animation=modal-orchestration__flip-reveal',
  title: '3D Flip Reveal',
  description:
    'Click-to-flip cards with 3D perspective reveal and staggered entrance. Configurable front/back content via items array, stagger, flip duration, and columns.',
  tier: 4,
  previewMaxWidth: 414,
} satisfies AnimationMetadata
