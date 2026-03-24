import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'update-indicators__home-icon-dot-radar',
  urlSlugFramer: '/update-indicators-framer?animation=update-indicators__home-icon-dot-radar',
  urlSlugCss: '/update-indicators-css?animation=update-indicators__home-icon-dot-radar',
  title: 'Home Icon \u2022 Radar Rings',
  description:
    'Staggered radar rings emanate from a notification dot. Wrap any element to signal ongoing freshness. Configure dotColor, dotSize, duration, ringColor, ringCount.',
  tier: 3,
  demoMode: 'icon-dot',
  infinite: true,
  props: [
    {
      type: 'string',
      name: 'children',
      label: 'Children',
      disabled: true,
      disabledReason: 'ReactNode — set via JSX children',
    },
    { type: 'color', name: 'dotColor', label: 'Dot Color', default: '#ff4967' },
    {
      type: 'number',
      name: 'dotSize',
      label: 'Dot Size',
      default: 14,
      min: 6,
      max: 32,
      step: 1,
      unit: 'px',
    },
    {
      type: 'number',
      name: 'duration',
      label: 'Duration',
      default: 1600,
      min: 400,
      max: 4000,
      step: 100,
      unit: 'ms',
    },
    { type: 'color', name: 'ringColor', label: 'Ring Color', default: 'rgb(255 73 103 / 50%)' },
    { type: 'number', name: 'ringCount', label: 'Ring Count', default: 2, min: 1, max: 5, step: 1 },
  ],
} satisfies AnimationMetadata
