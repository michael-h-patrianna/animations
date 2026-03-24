import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'modal-celebrations__coins-arc',
  urlSlugFramer: '/modal-celebrations-framer?animation=modal-celebrations__coins-arc',
  urlSlugCss: '/modal-celebrations-css?animation=modal-celebrations__coins-arc',
  title: 'Golden Eruption',
  description:
    'Coins erupt upward in parabolic arcs with 3D metallic spin. Configurable coinCount, coinImage, colors, duration, and onComplete callback.',
  tier: 4,
  props: [
    { type: 'number', name: 'coinCount', label: 'Coin Count', default: 20, min: 1, max: 60, step: 1 },
    { type: 'image', name: 'coinImage', label: 'Coin Image' },
    { type: 'number', name: 'duration', label: 'Duration', default: 1400, min: 400, max: 5000, step: 100, unit: 'ms' },
    { type: 'colors', name: 'colors', label: 'Colors', default: ['#ffd700', '#d97706', '#fde68a', '#fbbf24', '#ffc107'], maxItems: 8 },
    { type: 'images', name: 'particleImages', label: 'Particle Images', default: [], maxItems: 10 },
    { type: 'number', name: 'particleMaxWidth', label: 'Max Particle Width', default: 24, min: 8, max: 80, step: 2, unit: 'px' },
    { type: 'number', name: 'particleMaxHeight', label: 'Max Particle Height', default: 24, min: 8, max: 80, step: 2, unit: 'px' },
    { type: 'string', name: 'onComplete', label: 'On Complete', disabled: true, disabledReason: 'Callback — set in code' },
  ],
} satisfies AnimationMetadata
