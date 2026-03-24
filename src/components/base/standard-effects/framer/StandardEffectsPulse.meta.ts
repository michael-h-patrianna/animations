import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'standard-effects__pulse',
  urlSlugFramer: '/standard-effects-framer?animation=standard-effects__pulse',
  urlSlugCss: '/standard-effects-css?animation=standard-effects__pulse',
  title: 'Pulse',
  description:
    'Rhythmic scale pulse with expanding glow overlay. Wraps any element. Configurable cycle duration.',
  infinite: true,
  tier: 1,
  props: [
    {
      type: 'number',
      name: 'duration',
      label: 'Duration',
      default: 1500,
      min: 100,
      max: 5000,
      step: 50,
      unit: 'ms',
    },
    { type: 'color', name: 'glowColor', label: 'Glow Color', default: 'rgb(198 255 119 / 30%)' },
    {
      type: 'number',
      name: 'borderRadius',
      label: 'Border Radius',
      default: 16,
      min: 0,
      max: 100,
      step: 1,
      unit: 'px',
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
