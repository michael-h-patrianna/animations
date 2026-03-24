import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'progress-bars__flag-plant',
  urlSlugFramer: '/progress-bars-framer?animation=progress-bars__flag-plant',
  urlSlugCss: '/progress-bars-css?animation=progress-bars__flag-plant',
  title: 'Flag Plant',
  description: 'Flags are planted at specific milestones',
  tier: 4,
  previewMaxWidth: 414,
  props: [
    {
      type: 'number',
      name: 'progress',
      label: 'Progress',
      default: 0.72,
      min: 0,
      max: 1,
      step: 0.01,
    },
    { type: 'string', name: 'label', label: 'Label', default: 'Checkpoint Planting' },
    { type: 'image', name: 'markerIcon', label: 'Marker Icon' },
    {
      type: 'string',
      name: 'milestones',
      label: 'Milestones',
      disabled: true,
      disabledReason: 'MilestoneConfig[] — set via code',
    },
    { type: 'string', name: 'className', label: 'Class Name' },
    {
      type: 'string',
      name: 'style',
      label: 'Style',
      disabled: true,
      disabledReason: 'CSSProperties object — set via code',
    },
  ],
} satisfies AnimationMetadata
