import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'update-indicators__home-icon-dot-pulse',
  urlSlugFramer: '/update-indicators-framer?animation=update-indicators__home-icon-dot-pulse',
  urlSlugCss: '/update-indicators-css?animation=update-indicators__home-icon-dot-pulse',
  title: 'Home Icon \u2022 Dot Pulse',
  description:
    'Animated notification dot with gentle breathing pulse and soft glow ring. Wrap any element to signal unseen updates. Configure dotColor, dotSize, duration.',
  tier: 3,
  demoMode: 'icon-dot',
  props: [
    { type: 'string', name: 'children', label: 'Children', disabled: true, disabledReason: 'ReactNode — set via JSX children' },
    { type: 'color', name: 'dotColor', label: 'Dot Color', default: '#ff4967' },
    { type: 'number', name: 'dotSize', label: 'Dot Size', default: 14, min: 6, max: 32, step: 1, unit: 'px' },
    { type: 'number', name: 'duration', label: 'Duration', default: 1400, min: 400, max: 4000, step: 100, unit: 'ms' },
  ],
} satisfies AnimationMetadata
