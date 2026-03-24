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
