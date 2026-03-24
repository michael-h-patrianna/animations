import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'modal-orchestration__grid-highlight',
  urlSlugFramer: '/modal-orchestration-framer?animation=modal-orchestration__grid-highlight',
  urlSlugCss: '/modal-orchestration-css?animation=modal-orchestration__grid-highlight',
  title: 'Grid Highlight',
  description:
    'Wrap child elements in a grid with staggered scale-bounce entrance. Configurable stagger, duration, and columns.',
  tier: 3,
  previewMaxWidth: 414,
  props: [
    {
      type: 'number',
      name: 'stagger',
      label: 'Stagger',
      default: 260,
      min: 0,
      max: 1000,
      step: 10,
      unit: 'ms',
    },
    {
      type: 'number',
      name: 'duration',
      label: 'Duration',
      default: 210,
      min: 50,
      max: 2000,
      step: 10,
      unit: 'ms',
    },
    {
      type: 'number',
      name: 'distance',
      label: 'Distance',
      default: 16,
      min: 0,
      max: 100,
      step: 2,
      unit: 'px',
    },
    { type: 'number', name: 'columns', label: 'Columns', default: 2, min: 1, max: 6, step: 1 },
    {
      type: 'string',
      name: 'children',
      label: 'Children',
      disabled: true,
      disabledReason: 'Pass grid items via JSX children',
    },
  ],
} satisfies AnimationMetadata
