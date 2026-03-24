import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'modal-orchestration__spring-physics',
  urlSlugFramer: '/modal-orchestration-framer?animation=modal-orchestration__spring-physics',
  urlSlugCss: '/modal-orchestration-css?animation=modal-orchestration__spring-physics',
  title: 'Spring Physics Tiles',
  description:
    'Wrap child elements for spring-physics stagger entrance with CSS hover-lift and tap-press transitions. Configurable stagger, duration, and columns.',
  tier: 3,
  previewMaxWidth: 414,
  props: [
    { type: 'number', name: 'stagger', label: 'Stagger', default: 100, min: 0, max: 500, step: 10, unit: 'ms' },
    { type: 'number', name: 'stiffness', label: 'Stiffness', default: 200, min: 50, max: 1000, step: 10 },
    { type: 'number', name: 'damping', label: 'Damping', default: 15, min: 1, max: 50, step: 1 },
    { type: 'number', name: 'mass', label: 'Mass', default: 1.2, min: 0.1, max: 5, step: 0.1 },
    { type: 'number', name: 'columns', label: 'Columns', default: 3, min: 1, max: 6, step: 1 },
    { type: 'string', name: 'children', label: 'Children', disabled: true, disabledReason: 'Pass tile content via JSX children' },
  ],
} satisfies AnimationMetadata
