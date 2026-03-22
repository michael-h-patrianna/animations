import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'modal-orchestration__stagger-inview',
  urlSlugFramer: '/modal-orchestration-framer?animation=modal-orchestration__stagger-inview',
  urlSlugCss: '/modal-orchestration-css?animation=modal-orchestration__stagger-inview',
  title: 'Stagger In-View',
  description:
    'Wrap child elements to stagger-reveal them as the user scrolls into view. Configurable stagger delay, duration, distance, columns, and viewport threshold.',
  tier: 3,
  previewMaxWidth: 414,
} satisfies AnimationMetadata
