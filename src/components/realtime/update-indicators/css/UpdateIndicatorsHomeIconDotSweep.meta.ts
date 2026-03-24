import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'update-indicators__home-icon-dot-sweep',
  urlSlugFramer: '/update-indicators-framer?animation=update-indicators__home-icon-dot-sweep',
  urlSlugCss: '/update-indicators-css?animation=update-indicators__home-icon-dot-sweep',
  title: 'Home Icon \u2022 Comet Sweep',
  description:
    'Notification dot pulses with a color flash and scale bounce while an expanding halo ring radiates outward. Wrap any element. Configure dotColor, dotSize, duration, accentColor, haloColor.',
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
      default: 900,
      min: 200,
      max: 3000,
      step: 100,
      unit: 'ms',
    },
    { type: 'color', name: 'accentColor', label: 'Accent Color', default: '#ff0a4d' },
    { type: 'color', name: 'haloColor', label: 'Halo Color', default: 'rgb(255 73 103 / 55%)' },
  ],
} satisfies AnimationMetadata
