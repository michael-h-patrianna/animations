import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'modal-orchestration__wizard-fade-cross',
  urlSlugFramer: '/modal-orchestration-framer?animation=modal-orchestration__wizard-fade-cross',
  urlSlugCss: '/modal-orchestration-css?animation=modal-orchestration__wizard-fade-cross',
  title: 'Step Tiles Fade',
  description:
    'Wrap child panels for a sequential fade-up stagger entrance. Configurable stagger delay, duration, and distance.',
  tier: 3,
  previewMaxWidth: 414,
  props: [
    { type: 'number', name: 'stagger', label: 'Stagger', default: 260, min: 0, max: 1000, step: 10, unit: 'ms' },
    { type: 'number', name: 'duration', label: 'Duration', default: 260, min: 50, max: 2000, step: 10, unit: 'ms' },
    { type: 'number', name: 'distance', label: 'Distance', default: 16, min: 0, max: 100, step: 2, unit: 'px' },
    { type: 'string', name: 'children', label: 'Children', disabled: true, disabledReason: 'Pass step panels via JSX children' },
  ],
} satisfies AnimationMetadata
