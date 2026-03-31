import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'modal-orchestration__reorder-drag',
  title: 'Reorder Drag',
  description:
    'Drag-to-reorder tile list with lift effect (scale + shadow) while dragging. Displaced tiles slide out of the way in real time. Configurable tile count, gap, and drag scale.',
  tier: 3,
  disableReplay: true,
  infinite: true,
  previewMaxWidth: 414,
  props: [
    {
      type: 'number',
      name: 'count',
      label: 'Tile Count',
      default: 4,
      min: 2,
      max: 8,
      step: 1,
    },
    {
      type: 'number',
      name: 'gap',
      label: 'Gap',
      default: 12,
      min: 4,
      max: 32,
      step: 2,
      unit: 'px',
    },
    {
      type: 'number',
      name: 'dragScale',
      label: 'Drag Scale',
      default: 1.05,
      min: 1,
      max: 1.3,
      step: 0.01,
    },
    {
      type: 'string',
      name: 'children',
      label: 'Children',
      disabled: true,
      disabledReason: 'Pass custom tile content via JSX children',
    },
  ],
} satisfies AnimationMetadata
