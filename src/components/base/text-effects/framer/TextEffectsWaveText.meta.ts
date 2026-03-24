import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'text-effects__wave-text',
  urlSlugFramer: '/text-effects-framer?animation=text-effects__wave-text',
  urlSlugCss: '/text-effects-css?animation=text-effects__wave-text',
  title: 'Wave Text',
  description: 'Smooth undulating wave motion through characters for fluid text animations.',
  disableReplay: false,
  infinite: true,
  tier: 3,
  props: [
    { type: 'string', name: 'text', label: 'Text', default: 'WAVE MOTION' },
    {
      type: 'number',
      name: 'charDelay',
      label: 'Char Delay',
      default: 0.05,
      min: 0.01,
      max: 0.2,
      step: 0.01,
      unit: 's',
    },
    { type: 'boolean', name: 'showHighlight', label: 'Show Highlight', default: true },
    { type: 'color', name: 'color', label: 'Color', default: '#3b82f6' },
  ],
} satisfies AnimationMetadata
