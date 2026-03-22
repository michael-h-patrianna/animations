import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'modal-orchestration__wizard-fade-cross',
  urlSlugFramer: '/modal-orchestration-framer?animation=modal-orchestration__wizard-fade-cross',
  urlSlugCss: '/modal-orchestration-css?animation=modal-orchestration__wizard-fade-cross',
  title: 'Step Tiles Fade',
  description:
    'Wrap child panels for a sequential fade-up stagger entrance. Configurable stagger delay, duration, and distance.',
  tier: 3,
  previewMaxWidth: 414,
} satisfies AnimationMetadata
