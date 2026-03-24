import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'modal-base__unfold-origami',
  urlSlugFramer: '/modal-base-framer?animation=modal-base__unfold-origami',
  urlSlugCss: '/modal-base-css?animation=modal-base__unfold-origami',
  title: 'Origami Unfold',
  description:
    'Wrap your modal — origami unfold from rotateX(-180) with scale-up. Props: children, duration, perspective.',
  tier: 2,
  props: [
    {
      type: 'number',
      name: 'duration',
      label: 'Duration',
      default: 900,
      min: 100,
      max: 2000,
      step: 50,
      unit: 'ms',
    },
    {
      type: 'number',
      name: 'perspective',
      label: 'Perspective',
      default: 1200,
      min: 200,
      max: 3000,
      step: 50,
      unit: 'px',
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
