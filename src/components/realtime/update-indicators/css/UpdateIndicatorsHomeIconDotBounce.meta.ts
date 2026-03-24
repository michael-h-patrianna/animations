import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'update-indicators__home-icon-dot-bounce',
  urlSlugFramer: '/update-indicators-framer?animation=update-indicators__home-icon-dot-bounce',
  urlSlugCss: '/update-indicators-css?animation=update-indicators__home-icon-dot-bounce',
  title: 'Home Icon \u2022 Dot Bounce',
  description:
    'Animated notification dot that pops in with elastic overshoot and subtle idle bob. Wrap any element to add an attention-drawing indicator. Configure dotColor, dotSize, duration.',
  tier: 3,
  demoMode: 'icon-dot',
  props: [
    { type: 'string', name: 'children', label: 'Children', disabled: true, disabledReason: 'ReactNode — set via JSX children' },
    { type: 'color', name: 'dotColor', label: 'Dot Color', default: '#ff4967' },
    { type: 'number', name: 'dotSize', label: 'Dot Size', default: 14, min: 6, max: 32, step: 1, unit: 'px' },
    { type: 'number', name: 'duration', label: 'Duration', default: 2420, min: 500, max: 5000, step: 100, unit: 'ms' },
  ],
} satisfies AnimationMetadata
