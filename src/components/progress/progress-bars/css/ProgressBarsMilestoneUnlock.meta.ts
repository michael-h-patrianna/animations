import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'progress-bars__milestone-unlock',
  urlSlugFramer: '/progress-bars-framer?animation=progress-bars__milestone-unlock',
  urlSlugCss: '/progress-bars-css?animation=progress-bars__milestone-unlock',
  title: 'Milestone Unlock',
  description: 'Icons unlock and animate as progress passes them',
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
    { type: 'string', name: 'label', label: 'Label', default: 'Milestone Locks' },
    { type: 'image', name: 'lockedIcon', label: 'Locked Icon' },
    { type: 'image', name: 'unlockedIcon', label: 'Unlocked Icon' },
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
          key: '--unlock-track-bg',
          label: 'Track',
          default: 'rgb(255 255 255 / 8%)',
        },
        { type: 'color', key: '--unlock-fill-from', label: 'Fill Start', default: '#f59e0b' },
        { type: 'color', key: '--unlock-fill-to', label: 'Fill End', default: '#fbbf24' },
        {
          type: 'color',
          key: '--unlock-text-muted',
          label: 'Label Text',
          default: 'rgb(255 255 255 / 55%)',
        },
        {
          type: 'color',
          key: '--unlock-text-strong',
          label: 'Value Text',
          default: 'rgb(255 255 255 / 95%)',
        },
        {
          type: 'color',
          key: '--unlock-ring-active',
          label: 'Unlocked Ring',
          default: '#fbbf24',
        },
      ],
    },
  ],
} satisfies AnimationMetadata
