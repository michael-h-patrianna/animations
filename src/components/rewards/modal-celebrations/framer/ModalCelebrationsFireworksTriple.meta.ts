import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'modal-celebrations__fireworks-triple',
  urlSlugFramer: '/modal-celebrations-framer?animation=modal-celebrations__fireworks-triple',
  urlSlugCss: '/modal-celebrations-css?animation=modal-celebrations__fireworks-triple',
  title: 'Fireworks Triple Burst',
  description:
    'Three staggered starburst explosions with spark rays, trailing confetti, and shockwave rings. Self-contained choreography with onComplete callback.',
  tier: 3,
  props: [
    { type: 'number', name: 'duration', label: 'Duration', default: 2000, min: 800, max: 6000, step: 100, unit: 'ms' },
    { type: 'colors', name: 'colors', label: 'Colors', default: ['#ff5981', '#c6ff77', '#47fff4', '#ffce1a', '#ffffff'], maxItems: 8 },
    { type: 'images', name: 'particleImages', label: 'Particle Images', default: [], maxItems: 10 },
    { type: 'number', name: 'particleMaxWidth', label: 'Max Particle Width', default: 24, min: 8, max: 80, step: 2, unit: 'px' },
    { type: 'number', name: 'particleMaxHeight', label: 'Max Particle Height', default: 24, min: 8, max: 80, step: 2, unit: 'px' },
    { type: 'string', name: 'onComplete', label: 'On Complete', disabled: true, disabledReason: 'Callback — set in code' },
  ],
} satisfies AnimationMetadata
