import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'modal-orchestration__comparison-morph',
  urlSlugFramer: '/modal-orchestration-framer?animation=modal-orchestration__comparison-morph',
  urlSlugCss: '/modal-orchestration-css?animation=modal-orchestration__comparison-morph',
  title: 'Comparison Tiles',
  description:
    'Wrap comparison panes for a rotate-scale morph entrance. Configurable stagger delay and duration.',
  tier: 3,
  previewMaxWidth: 414,
  props: [
    { type: 'number', name: 'stagger', label: 'Stagger', default: 260, min: 0, max: 1000, step: 10, unit: 'ms' },
    { type: 'number', name: 'duration', label: 'Duration', default: 312, min: 100, max: 2000, step: 10, unit: 'ms' },
    { type: 'string', name: 'children', label: 'Children', disabled: true, disabledReason: 'Pass comparison panes via JSX children' },
  ],
} satisfies AnimationMetadata
