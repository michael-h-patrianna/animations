import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'modal-orchestration__wizard-slide-stack',
  urlSlugFramer: '/modal-orchestration-framer?animation=modal-orchestration__wizard-slide-stack',
  urlSlugCss: '/modal-orchestration-css?animation=modal-orchestration__wizard-slide-stack',
  title: 'Step Tiles Slide',
  description:
    'Wrap child panels for a sequential slide-from-right stagger entrance. Configurable stagger delay, duration, and slide distance.',
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
      default: 312,
      min: 100,
      max: 2000,
      step: 10,
      unit: 'ms',
    },
    {
      type: 'number',
      name: 'distance',
      label: 'Distance',
      default: 48,
      min: 0,
      max: 200,
      step: 4,
      unit: 'px',
    },
    {
      type: 'string',
      name: 'children',
      label: 'Children',
      disabled: true,
      disabledReason: 'Pass step panels via JSX children',
    },
  ],
} satisfies AnimationMetadata
