import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'modal-base__flip-3d',
  urlSlugFramer: '/modal-base-framer?animation=modal-base__flip-3d',
  urlSlugCss: '/modal-base-css?animation=modal-base__flip-3d',
  title: '3D Card Flip',
  description:
    'Wrap your modal — 3D card flip from 180deg with scale-up. Props: children, duration, perspective.',
  tier: 2,
  props: [
    {
      type: 'number',
      name: 'duration',
      label: 'Duration',
      default: 800,
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
    {
      type: 'string',
      name: 'className',
      label: 'CSS Class',
      default: '',
      description: 'Additional CSS class name for the content wrapper.',
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
