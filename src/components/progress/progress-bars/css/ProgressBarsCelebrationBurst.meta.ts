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
    },
    {
      type: 'string',
      name: 'milestones',
      label: 'Milestones',
      disabled: true,
      disabledReason: 'MilestoneConfig[] — set via code',
    },
    {
      type: 'string',
      name: 'style',
      label: 'Style',
      disabled: true,
      disabledReason: 'CSSProperties object — set via code',
    },
  ],
}
