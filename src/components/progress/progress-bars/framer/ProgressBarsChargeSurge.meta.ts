import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'progress-bars__charge-surge',
  urlSlugFramer: '/progress-bars-framer?animation=progress-bars__charge-surge',
  urlSlugCss: '/progress-bars-css?animation=progress-bars__charge-surge',
  title: 'Charge Surge',
  description:
    'Charge surge bar with anticipation tremors and wave effects at milestones. Pass `progress` (0-1) and `milestones` for controlled mode. Style via --charge-track-color, --charge-fill-color, --charge-marker-color.',
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
          key: '--charge-track-bg',
          label: 'Track',
          default: 'rgb(255 255 255 / 8%)',
        },
        { type: 'color', key: '--charge-fill-from', label: 'Fill Start', default: '#3b82f6' },
        { type: 'color', key: '--charge-fill-to', label: 'Fill End', default: '#60a5fa' },
        {
          type: 'color',
          key: '--charge-marker-color',
          label: 'Marker',
          default: 'rgb(96 165 250 / 40%)',
        },
        {
          type: 'color',
          key: '--charge-wave-color',
          label: 'Wave',
          default: 'rgb(96 165 250 / 50%)',
        },
      ],
    },
  ],
}
