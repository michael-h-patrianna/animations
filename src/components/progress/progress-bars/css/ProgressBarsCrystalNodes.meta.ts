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
    {
      type: 'number',
      name: 'progress',
      label: 'Progress',
      default: 0.72,
      min: 0,
      max: 1,
      step: 0.01,
      animatable: true,
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
        { type: 'color', key: '--crystal-bg', label: 'Background', default: '#0c1220' },
        {
          type: 'color',
          key: '--crystal-track-bg',
          label: 'Track',
          default: 'rgb(34 211 238 / 10%)',
        },
        { type: 'color', key: '--crystal-fill', label: 'Fill', default: '#22d3ee' },
        { type: 'color', key: '--crystal-active', label: 'Active Crystal', default: '#22d3ee' },
        {
          type: 'color',
          key: '--crystal-inactive',
          label: 'Inactive Crystal',
          default: 'rgb(34 211 238 / 12%)',
        },
      ],
    },
  ],
} satisfies AnimationMetadata
