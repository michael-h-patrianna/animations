import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'standard-effects__stamp-down',
  urlSlugFramer: '/standard-effects-framer?animation=standard-effects__stamp-down',
  urlSlugCss: '/standard-effects-css?animation=standard-effects__stamp-down',
  title: 'Stamp Down',
  description:
    'Impact slam entrance — element drops from oversized to normal with bounce settle. Stars slam after level completion, rank badges land with weight, approval seals stamp down. Configurable start scale, impact rotation, and duration.',
  tier: 1,
  props: [
    {
      type: 'number',
      name: 'duration',
      label: 'Duration',
      default: 350,
      min: 150,
      max: 800,
      step: 25,
      unit: 'ms',
    },
    {
      type: 'number',
      name: 'startScale',
      label: 'Start Scale',
      default: 2.0,
      min: 1.3,
      max: 4.0,
      step: 0.1,
    },
    {
      type: 'number',
      name: 'impactRotation',
      label: 'Impact Rotation',
      default: 2,
      min: 0,
      max: 8,
      step: 0.5,
      unit: 'deg',
    },
    {
      type: 'string',
      name: 'children',
      label: 'Children',
      disabled: true,
      disabledReason: 'Pass content via JSX children',
    },
  ],
} satisfies AnimationMetadata
