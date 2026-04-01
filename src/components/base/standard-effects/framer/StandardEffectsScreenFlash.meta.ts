import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'standard-effects__screen-flash',
  urlSlugFramer: '/standard-effects-framer?animation=standard-effects__screen-flash',
  urlSlugCss: '/standard-effects-css?animation=standard-effects__screen-flash',
  title: 'Screen Flash',
  description:
    'Full-container impact flash overlay. Fires once on mount — bright burst that rapidly fades. Configurable color, fade duration, and peak hold time.',
  tier: 1,
  props: [
    {
      type: 'color',
      name: 'color',
      label: 'Flash Color',
      default: 'rgba(255, 255, 255, 0.9)',
    },
    {
      type: 'number',
      name: 'duration',
      label: 'Fade Duration',
      default: 400,
      min: 100,
      max: 1000,
      step: 50,
      unit: 'ms',
    },
    {
      type: 'number',
      name: 'peakDuration',
      label: 'Peak Hold',
      default: 80,
      min: 0,
      max: 300,
      step: 10,
      unit: 'ms',
    },
    {
      type: 'string',
      name: 'children',
      label: 'Children',
      disabled: true,
      disabledReason: 'Pass content via JSX children',
    },
  ],
}
