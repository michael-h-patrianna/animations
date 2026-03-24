import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'modal-orchestration__magnetic-hover',
  urlSlugFramer: '/modal-orchestration-framer?animation=modal-orchestration__magnetic-hover',
  urlSlugCss: '/modal-orchestration-css?animation=modal-orchestration__magnetic-hover',
  title: 'Magnetic Hover Tiles',
  description:
    'Wrap child elements for 3D-tilt stagger entrance with CSS hover and tap transitions. Configurable stagger, duration, and columns.',
  tier: 3,
  previewMaxWidth: 414,
  props: [
    {
      type: 'number',
      name: 'stagger',
      label: 'Stagger',
      default: 100,
      min: 0,
      max: 500,
      step: 10,
      unit: 'ms',
    },
    {
      type: 'number',
      name: 'duration',
      label: 'Duration',
      default: 600,
      min: 100,
      max: 2000,
      step: 50,
      unit: 'ms',
    },
    {
      type: 'number',
      name: 'tiltIntensity',
      label: 'Tilt Intensity',
      default: 5,
      min: 1,
      max: 20,
      step: 1,
      unit: 'deg',
    },
    { type: 'number', name: 'columns', label: 'Columns', default: 4, min: 1, max: 6, step: 1 },
    {
      type: 'string',
      name: 'children',
      label: 'Children',
      disabled: true,
      disabledReason: 'Pass tile content via JSX children',
    },
  ],
} satisfies AnimationMetadata
