import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'progress-bars__progress-segmented',
  urlSlugFramer: '/progress-bars-framer?animation=progress-bars__progress-segmented',
  urlSlugCss: '/progress-bars-css?animation=progress-bars__progress-segmented',
  title: 'Segmented Sweep',
  description:
    'Segmented progress bar with glow on completion. Pass `progress` (0-1) for controlled mode. Optional `segments` prop. Style via --segmented-track-color, --segmented-fill-from/to, --segmented-height.',
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
    { type: 'number', name: 'segments', label: 'Segments', default: 4, min: 2, max: 12, step: 1 },
    {
      type: 'string',
      name: 'style',
      label: 'Style',
      disabled: true,
      disabledReason: 'CSSProperties object — set via code',
    },
  ],
}
