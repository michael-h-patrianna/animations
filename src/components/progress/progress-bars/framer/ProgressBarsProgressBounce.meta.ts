import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'progress-bars__progress-bounce',
  urlSlugFramer: '/progress-bars-framer?animation=progress-bars__progress-bounce',
  urlSlugCss: '/progress-bars-css?animation=progress-bars__progress-bounce',
  title: 'Grow up',
  description:
    'Bounce-fill bar with overshoot, track deformation, impact waves, and celebration particles. Pass `progress` (0-1) for controlled mode. Style via --bounce-track-color, --bounce-fill-from/to, --bounce-height.',
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
      name: 'style',
      label: 'Style',
      disabled: true,
      disabledReason: 'CSSProperties object — set via code',
    },
  ],
}
