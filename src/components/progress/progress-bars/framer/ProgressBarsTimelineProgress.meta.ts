import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'progress-bars__timeline-progress',
  urlSlugFramer: '/progress-bars-framer?animation=progress-bars__timeline-progress',
  urlSlugCss: '/progress-bars-css?animation=progress-bars__timeline-progress',
  title: 'Timeline Progress',
  description:
    'Step-by-step timeline with staggered pop animation. Pass `progress` (0-1) and optional `steps` for controlled mode. Style via --timeline-step-bg, --timeline-step-border, --timeline-step-text.',
  tier: 3,
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
    { type: 'number', name: 'steps', label: 'Steps', default: 4, min: 2, max: 10, step: 1 },
    {
      type: 'string',
      name: 'style',
      label: 'Style',
      disabled: true,
      disabledReason: 'CSSProperties object — set via code',
    },
  ],
}
