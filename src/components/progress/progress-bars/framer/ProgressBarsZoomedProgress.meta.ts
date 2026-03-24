import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'progress-bars__zoomed-progress',
  urlSlugFramer: '/progress-bars-framer?animation=progress-bars__zoomed-progress',
  urlSlugCss: '/progress-bars-css?animation=progress-bars__zoomed-progress',
  title: 'Zoomed Progress',
  description:
    'Multi-level progress bar with zoomed viewport that shifts and scales as levels advance. Features numbered milestones, color transitions per level (blue to yellow to pink), radial gradient masking for zoom effect, and skewed progress fill animation.',
  tier: 4,
  previewMaxWidth: 414,
  props: [
    { type: 'number', name: 'progress', label: 'Progress', default: 0.72, min: 0, max: 1, step: 0.01 },
    { type: 'string', name: 'className', label: 'Class Name' },
    { type: 'string', name: 'style', label: 'Style', disabled: true, disabledReason: 'CSSProperties object — set via code' },
  ],
}
