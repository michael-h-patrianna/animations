import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'text-effects__verb-jumping',
  urlSlugFramer: '/text-effects-framer?animation=text-effects__verb-jumping',
  urlSlugCss: '/text-effects-css?animation=text-effects__verb-jumping',
  title: 'Jumping',
  description: 'Playful jump cadence with squash and stretch per letter.',
  tier: 3,
  props: [
    { type: 'string', name: 'text', label: 'Text', default: 'LOREM IPSUM DOLOR' },
    {
      type: 'number',
      name: 'stepDelay',
      label: 'Step Delay',
      default: 0.06,
      min: 0.01,
      max: 0.2,
      step: 0.01,
      unit: 's',
    },
    { type: 'color', name: 'color', label: 'Color', default: '#e8e4da' },
  ],
} satisfies AnimationMetadata
