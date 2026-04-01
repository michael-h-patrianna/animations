import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'text-effects__glitch-text',
  urlSlugFramer: '/text-effects-framer?animation=text-effects__glitch-text',
  urlSlugCss: '/text-effects-css?animation=text-effects__glitch-text',
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
    { type: 'color', name: 'color', label: 'Color', default: '#ffffff' },
  ],
}
