import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'progress-bars__elastic-fill',
  urlSlugFramer: '/progress-bars-framer?animation=progress-bars__elastic-fill',
  urlSlugCss: '/progress-bars-css?animation=progress-bars__elastic-fill',
  title: 'Elastic Fill',
  description:
    'Progress bar with elastic overshoot and squash physics. Pass `progress` (0-1) for controlled mode, or omit for demo. Style via --elastic-fill-track-color, --elastic-fill-from, --elastic-fill-to, --elastic-fill-height, --elastic-fill-radius.',
  tier: 2,
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
      name: 'style',
      label: 'Style',
      disabled: true,
      disabledReason: 'CSSProperties object — set via code',
    },
  ],
}
