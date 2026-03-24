import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'modal-base__portal-swirl',
  urlSlugFramer: '/modal-base-framer?animation=modal-base__portal-swirl',
  urlSlugCss: '/modal-base-css?animation=modal-base__portal-swirl',
  title: 'Portal Swirl',
  description:
    'Wrap your modal — 720deg spiral with morphing border-radius. Props: children, duration.',
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
