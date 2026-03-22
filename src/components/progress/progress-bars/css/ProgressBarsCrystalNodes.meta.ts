import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'progress-bars__crystal-nodes',
  urlSlugFramer: '/progress-bars-framer?animation=progress-bars__crystal-nodes',
  urlSlugCss: '/progress-bars-css?animation=progress-bars__crystal-nodes',
  title: 'Crystal Nodes',
  description:
    'Crystal-node milestone bar with charge-up burst effects. Pass `progress` (0-1) and `milestones` for controlled mode. Style via --crystal-track-color, --crystal-fill-color, --crystal-active-color, --crystal-inactive-color.',
  tier: 4,
  previewMaxWidth: 414,
} satisfies AnimationMetadata
