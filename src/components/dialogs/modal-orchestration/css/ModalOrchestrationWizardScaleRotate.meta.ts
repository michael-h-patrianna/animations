import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'modal-orchestration__wizard-scale-rotate',
  urlSlugFramer: '/modal-orchestration-framer?animation=modal-orchestration__wizard-scale-rotate',
  urlSlugCss: '/modal-orchestration-css?animation=modal-orchestration__wizard-scale-rotate',
  title: 'Step Tiles Scale',
  description:
    'Two-layer entrance: pop-scale step indicators + rotate-morph content panels. Configurable step labels, active step, stagger, and duration.',
  tier: 3,
  previewMaxWidth: 414,
  props: [
    { type: 'number', name: 'stagger', label: 'Stagger', default: 260, min: 0, max: 1000, step: 10, unit: 'ms' },
    { type: 'number', name: 'duration', label: 'Duration', default: 312, min: 100, max: 2000, step: 10, unit: 'ms' },
    { type: 'number', name: 'activeStep', label: 'Active Step', default: 0, min: 0, max: 10, step: 1 },
    { type: 'string', name: 'children', label: 'Children', disabled: true, disabledReason: 'Pass step panels via JSX children' },
    { type: 'string', name: 'stepLabels', label: 'Step Labels', disabled: true, disabledReason: 'String array — configure in code' },
  ],
} satisfies AnimationMetadata
