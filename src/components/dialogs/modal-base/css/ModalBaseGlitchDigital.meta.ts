import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'modal-base__tfx-glitchdigital',
  urlSlugFramer: '/modal-base-framer?animation=modal-base__tfx-glitchdigital',
  urlSlugCss: '/modal-base-css?animation=modal-base__tfx-glitchdigital',
  title: 'Digital Glitch',
  description:
    'Wrap your modal — RGB channel separation with digital glitch skew. Props: children, duration, intensity.',
  tier: 2,
  props: [
    {
      type: 'number',
      name: 'duration',
      label: 'Duration',
      default: 600,
      min: 100,
      max: 2000,
      step: 50,
      unit: 'ms',
    },
    {
      type: 'number',
      name: 'intensity',
      label: 'Intensity',
      default: 1,
      min: 0,
      max: 1,
      step: 0.05,
    },
    {
      type: 'string',
      name: 'children',
      label: 'Children',
      disabled: true,
      disabledReason: 'Pass content via JSX children',
    },
    {
      type: 'string',
      name: 'style',
      label: 'Inline Styles',
      disabled: true,
      disabledReason: 'CSSProperties object — set in code',
    },
    {
      type: 'string',
      name: 'onAnimationComplete',
      label: 'On Complete',
      disabled: true,
      disabledReason: 'Callback — set in code',
    },
  ],
}
