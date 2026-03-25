import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'progress-bars__progress-milestones',
  urlSlugFramer: '/progress-bars-framer?animation=progress-bars__progress-milestones',
  urlSlugCss: '/progress-bars-css?animation=progress-bars__progress-milestones',
  title: 'Milestone Markers',
  description:
    'Milestone progress bar with diamond markers and ring pulse effects. Pass `progress` (0-1) and `milestones` array for controlled mode. Style via --milestone-track-color, --milestone-fill-from/to, --milestone-marker-color, --milestone-active-color.',
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
          key: '--milestone-track-bg',
          label: 'Track',
          default: 'rgb(255 255 255 / 8%)',
        },
        { type: 'color', key: '--milestone-fill-from', label: 'Fill Start', default: '#38bdf8' },
        { type: 'color', key: '--milestone-fill-to', label: 'Fill End', default: '#7dd3fc' },
        {
          type: 'color',
          key: '--milestone-marker-color',
          label: 'Inactive Marker',
          default: 'rgb(56 189 248 / 40%)',
        },
        {
          type: 'color',
          key: '--milestone-active-color',
          label: 'Active Marker',
          default: '#7dd3fc',
        },
      ],
    },
  ],
}
