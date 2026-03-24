import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'modal-content__form-field-gradient',
  urlSlugFramer: '/modal-content-framer?animation=modal-content__form-field-gradient',
  urlSlugCss: '/modal-content-css?animation=modal-content__form-field-gradient',
  title: 'Form Gradient Sweep',
  description:
    'Gradient sweep stagger. Each child slides up with a blue gradient pulse before settling. Props: duration, stagger.',
  tier: 3,
  props: [
    {
      type: 'number',
      name: 'duration',
      label: 'Duration',
      default: 500,
      min: 100,
      max: 2000,
      step: 50,
      unit: 'ms',
    },
    {
      type: 'number',
      name: 'stagger',
      label: 'Stagger',
      default: 120,
      min: 0,
      max: 500,
      step: 10,
      unit: 'ms',
    },
    { type: 'string', name: 'className', label: 'CSS Class', default: '' },
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
