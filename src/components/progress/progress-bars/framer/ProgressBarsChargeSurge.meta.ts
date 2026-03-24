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
    { type: 'number', name: 'progress', label: 'Progress', default: 0.72, min: 0, max: 1, step: 0.01 },
    { type: 'string', name: 'milestones', label: 'Milestones', disabled: true, disabledReason: 'MilestoneConfig[] — set via code' },
    { type: 'string', name: 'className', label: 'Class Name' },
    { type: 'string', name: 'style', label: 'Style', disabled: true, disabledReason: 'CSSProperties object — set via code' },
  ],
}
