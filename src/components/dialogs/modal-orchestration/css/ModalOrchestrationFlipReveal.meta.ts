import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'modal-orchestration__flip-reveal',
  urlSlugFramer: '/modal-orchestration-framer?animation=modal-orchestration__flip-reveal',
  urlSlugCss: '/modal-orchestration-css?animation=modal-orchestration__flip-reveal',
  title: '3D Flip Reveal',
  description:
    'Click-to-flip cards with 3D perspective reveal and staggered entrance. Configurable front/back content via items array, stagger, flip duration, and columns.',
  tier: 4,
  previewMaxWidth: 414,
  props: [
    { type: 'number', name: 'stagger', label: 'Stagger', default: 100, min: 0, max: 500, step: 10, unit: 'ms' },
    { type: 'number', name: 'flipDuration', label: 'Flip Duration', default: 600, min: 100, max: 2000, step: 50, unit: 'ms' },
    { type: 'number', name: 'columns', label: 'Columns', default: 3, min: 1, max: 6, step: 1 },
    { type: 'number', name: 'cardHeight', label: 'Card Height', default: 120, min: 60, max: 300, step: 10, unit: 'px' },
    { type: 'string', name: 'items', label: 'Items', disabled: true, disabledReason: 'Array of {front, back} objects — configure in code' },
  ],
} satisfies AnimationMetadata
