import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'text-effects__verb-floating',
  urlSlugFramer: '/text-effects-framer?animation=text-effects__verb-floating',
  urlSlugCss: '/text-effects-css?animation=text-effects__verb-floating',
  title: 'Floating',
  description: 'Gentle float up/down across letters with offset phases.',
  disableReplay: false,
  infinite: true,
  tier: 3,
  props: [
    { type: 'string', name: 'text', label: 'Text', default: 'LOREM IPSUM DOLOR' },
    { type: 'color', name: 'color', label: 'Color', default: '#e8e4da' },
  ],
}
