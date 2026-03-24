import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'progress-bars__sci-fi-loader',
  urlSlugFramer: '/progress-bars-framer?animation=progress-bars__sci-fi-loader',
  urlSlugCss: '/progress-bars-css?animation=progress-bars__sci-fi-loader',
  title: 'Sci-Fi Loader',
  description:
    'Futuristic skewed progress bar with glint sweep. Pass `progress` (0-1) for controlled mode. Optional `label` prop. Style via --scifi-bg, --scifi-fill, --scifi-accent, --scifi-text.',
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
    { type: 'string', name: 'label', label: 'Label', default: 'SYSTEM.INIT:' },
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
