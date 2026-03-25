import type { AnimationMetadata } from '@/types/animation'

// CSS variant exposes `duration` instead of spring params (stiffness/damping/mass)
// because CSS cannot simulate true spring physics. The Framer variant uses spring params.
export const metadata = {
  id: 'modal-orchestration__spring-physics',
  urlSlugFramer: '/modal-orchestration-framer?animation=modal-orchestration__spring-physics',
  urlSlugCss: '/modal-orchestration-css?animation=modal-orchestration__spring-physics',
  title: 'Spring Physics Tiles',
  description:
    'Wrap child elements for a spring-like stagger entrance with hover-lift and tap-press transitions. Configurable stagger, columns, and variant-specific timing controls.',
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
      default: 800,
      min: 100,
      max: 2000,
      step: 10,
      unit: 'ms',
    },
    { type: 'number', name: 'columns', label: 'Columns', default: 3, min: 1, max: 6, step: 1 },
    {
      type: 'string',
      name: 'children',
      label: 'Children',
      disabled: true,
      disabledReason: 'Pass tile content via JSX children',
    },
  ],
} satisfies AnimationMetadata
