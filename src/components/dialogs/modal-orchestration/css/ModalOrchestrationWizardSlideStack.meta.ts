import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'modal-orchestration__wizard-slide-stack',
  urlSlugFramer: '/modal-orchestration-framer?animation=modal-orchestration__wizard-slide-stack',
  urlSlugCss: '/modal-orchestration-css?animation=modal-orchestration__wizard-slide-stack',
  title: 'Step Tiles Slide',
  description:
    'Wrap child panels for a sequential slide-from-right stagger entrance. Configurable stagger delay, duration, and slide distance.',
  tier: 3,
  previewMaxWidth: 414,
} satisfies AnimationMetadata
