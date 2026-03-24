import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'text-effects__verb-twirling',
  urlSlugFramer: '/text-effects-framer?animation=text-effects__verb-twirling',
  urlSlugCss: '/text-effects-css?animation=text-effects__verb-twirling',
  title: 'Twirling',
  description: 'Continuous twirl spin with subtle scale variance.',
  disableReplay: false,
  tier: 3,
  props: [
    { type: 'string', name: 'text', label: 'Text', default: 'LOREM IPSUM DOLOR' },
    { type: 'color', name: 'color', label: 'Color', default: '#e8e4da' },
  ],
}
