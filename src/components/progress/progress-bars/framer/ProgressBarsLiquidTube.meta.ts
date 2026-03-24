import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'progress-bars__liquid-tube',
  urlSlugFramer: '/progress-bars-framer?animation=progress-bars__liquid-tube',
  urlSlugCss: '/progress-bars-css?animation=progress-bars__liquid-tube',
  title: 'Liquid Tube',
  description:
    'Vertical liquid tube with wave surface and rising bubbles. Pass `progress` (0-1) for controlled mode. Style via --liquid-tube-border, --liquid-tube-bg, --liquid-tube-fill, --liquid-tube-bubble.',
  tier: 4,
  previewMaxWidth: 414,
  props: [
    { type: 'number', name: 'progress', label: 'Progress', default: 0.72, min: 0, max: 1, step: 0.01 },
    { type: 'string', name: 'className', label: 'Class Name' },
    { type: 'string', name: 'style', label: 'Style', disabled: true, disabledReason: 'CSSProperties object — set via code' },
  ],
} satisfies AnimationMetadata
