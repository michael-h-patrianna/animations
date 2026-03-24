import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'modal-celebrations__confetti-spiral',
  urlSlugFramer: '/modal-celebrations-framer?animation=modal-celebrations__confetti-spiral',
  urlSlugCss: '/modal-celebrations-css?animation=modal-celebrations__confetti-spiral',
  title: 'Confetti Spiral',
  description:
    'Dynamic tornado confetti — particles orbit center in 3 spiral arms with gravity release. Configurable particleCount, colors, duration, and onComplete callback.',
  tier: 3,
  props: [
    { type: 'number', name: 'particleCount', label: 'Particle Count', default: 54, min: 10, max: 120, step: 1 },
    { type: 'number', name: 'duration', label: 'Duration', default: 2500, min: 800, max: 6000, step: 100, unit: 'ms' },
    { type: 'colors', name: 'colors', label: 'Colors', default: ['#ff5981', '#c6ff77', '#47fff4', '#ffce1a', '#ffffff'], maxItems: 8 },
    { type: 'images', name: 'particleImages', label: 'Particle Images', default: [], maxItems: 10 },
    { type: 'number', name: 'particleMaxWidth', label: 'Max Particle Width', default: 24, min: 8, max: 80, step: 2, unit: 'px' },
    { type: 'number', name: 'particleMaxHeight', label: 'Max Particle Height', default: 24, min: 8, max: 80, step: 2, unit: 'px' },
    { type: 'string', name: 'onComplete', label: 'On Complete', disabled: true, disabledReason: 'Callback — set in code' },
  ],
} satisfies AnimationMetadata
