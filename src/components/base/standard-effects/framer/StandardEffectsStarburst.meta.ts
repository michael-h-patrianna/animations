import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'standard-effects__starburst',
  urlSlugFramer: '/standard-effects-framer?animation=standard-effects__starburst',
  urlSlugCss: '/standard-effects-css?animation=standard-effects__starburst',
  title: 'Starburst',
  description:
    'Radial light rays rotate around a breathing center glow. Wraps content with a reward-highlight background. Configurable ray count, colors, size, and rotation speed.',
  tier: 1,
  infinite: true,
  disableReplay: true,
  props: [
    {
      type: 'color',
      name: 'rayColor',
      label: 'Ray Color',
      default: 'rgba(255, 180, 0, 0.15)',
    },
    {
      type: 'color',
      name: 'glowColor',
      label: 'Glow Color',
      default: 'rgba(255, 220, 100, 0.8)',
    },
    {
      type: 'number',
      name: 'rayCount',
      label: 'Ray Count',
      default: 12,
      min: 4,
      max: 24,
      step: 2,
    },
    {
      type: 'number',
      name: 'rotationSpeed',
      label: 'Rotation Speed',
      default: 10000,
      min: 3000,
      max: 30000,
      step: 1000,
      unit: 'ms',
    },
    {
      type: 'number',
      name: 'size',
      label: 'Size',
      default: 200,
      min: 80,
      max: 500,
      step: 10,
      unit: 'px',
    },
    {
      type: 'string',
      name: 'children',
      label: 'Children',
      disabled: true,
      disabledReason: 'ReactNode — pass as JSX children',
    },
  ],
}
