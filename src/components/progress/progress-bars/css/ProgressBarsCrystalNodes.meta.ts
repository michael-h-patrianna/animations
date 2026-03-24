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
  props: [
    { type: 'number', name: 'progress', label: 'Progress', default: 0.72, min: 0, max: 1, step: 0.01 },
    { type: 'string', name: 'milestones', label: 'Milestones', disabled: true, disabledReason: 'MilestoneConfig[] — set via code' },
    { type: 'string', name: 'className', label: 'Class Name' },
    { type: 'string', name: 'style', label: 'Style', disabled: true, disabledReason: 'CSSProperties object — set via code' },
  ],
} satisfies AnimationMetadata
