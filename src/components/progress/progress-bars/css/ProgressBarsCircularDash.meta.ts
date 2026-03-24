import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'progress-bars__circular-dash',
  urlSlugFramer: '/progress-bars-framer?animation=progress-bars__circular-dash',
  urlSlugCss: '/progress-bars-css?animation=progress-bars__circular-dash',
  title: 'Circular Dash',
  description:
    'Circular segmented ring progress. Pass `progress` (0-1) for controlled mode. Optional `segments` prop. Style via --circular-dash-active, --circular-dash-inactive, --circular-dash-text, --circular-dash-size.',
  tier: 4,
  previewMaxWidth: 414,
  props: [
    { type: 'number', name: 'progress', label: 'Progress', default: 0.72, min: 0, max: 1, step: 0.01 },
    { type: 'number', name: 'segments', label: 'Segments', default: 12, min: 2, max: 24, step: 1 },
    { type: 'string', name: 'className', label: 'Class Name' },
    { type: 'string', name: 'style', label: 'Style', disabled: true, disabledReason: 'CSSProperties object — set via code' },
  ],
} satisfies AnimationMetadata
