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
    {
      type: 'style-object',
      name: 'style',
      label: 'Theme',
      fields: [
        {
          type: 'color',
          key: '--flag-track-bg',
          label: 'Track',
          default: 'rgb(255 255 255 / 8%)',
        },
        { type: 'color', key: '--flag-fill-from', label: 'Fill Start', default: '#f97316' },
        { type: 'color', key: '--flag-fill-to', label: 'Fill End', default: '#fb923c' },
        {
          type: 'color',
          key: '--flag-text-muted',
          label: 'Label Text',
          default: 'rgb(255 255 255 / 55%)',
        },
        {
          type: 'color',
          key: '--flag-text-strong',
          label: 'Value Text',
          default: 'rgb(255 255 255 / 95%)',
        },
        { type: 'color', key: '--flag-pulse', label: 'Flag Pulse', default: 'rgb(251 146 60 / 40%)' },
      ],
    },
  ],
} satisfies AnimationMetadata
