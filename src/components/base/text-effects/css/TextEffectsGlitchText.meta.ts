import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'text-effects__tfx-glitchtext',
  urlSlugFramer: '/text-effects-framer?animation=text-effects__tfx-glitchtext',
  urlSlugCss: '/text-effects-css?animation=text-effects__tfx-glitchtext',
  title: 'Glitch Text',
  description: 'Digital distortion with RGB channel separation and scanning line artifacts.',
  disableReplay: false,
  infinite: true,
  tier: 2,
  props: [
    { type: 'string', name: 'text', label: 'Text', default: 'SYSTEM ERROR' },
    {
      type: 'string',
      name: 'children',
      label: 'Children',
      disabled: true,
      disabledReason: 'Pass content via JSX children',
    },
    {
      type: 'string',
      name: 'className',
      label: 'Class Name',
      disabled: true,
      disabledReason: 'Pass additional CSS classes via props',
    },
    { type: 'color', name: 'color', label: 'Color', default: '#ffffff' },
  ],
}
