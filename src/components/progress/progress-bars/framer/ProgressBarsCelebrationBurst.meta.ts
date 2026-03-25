import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'progress-bars__celebration-burst',
  urlSlugFramer: '/progress-bars-framer?animation=progress-bars__celebration-burst',
  urlSlugCss: '/progress-bars-css?animation=progress-bars__celebration-burst',
  title: 'Celebration Burst',
  description:
    'Progress bar with particle burst effects at milestones. Pass `progress` (0-1) and `milestones` for controlled mode. Style via --burst-track-color, --burst-fill-from/to, --burst-marker-color.',
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
        {
          type: 'color',
          key: '--progress-bars-celebration-burst-bg-1',
          label: 'Track',
          default: 'rgb(78 24 124 / 12%)',
        },
        {
          type: 'color',
          key: '--progress-bars-celebration-burst-bg-2',
          label: 'Fill Start',
          default: 'rgb(147 51 234 / 90%)',
        },
        {
          type: 'color',
          key: '--progress-bars-celebration-burst-bg-3',
          label: 'Fill End',
          default: 'rgb(168 85 247 / 100%)',
        },
        { type: 'color', key: '--burst-marker-color', label: 'Marker', default: '#a855f7' },
      ],
    },
  ],
}
