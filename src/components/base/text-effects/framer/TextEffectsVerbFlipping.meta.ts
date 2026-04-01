import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'text-effects__verb-flipping',
  urlSlugFramer: '/text-effects-framer?animation=text-effects__verb-flipping',
  urlSlugCss: '/text-effects-css?animation=text-effects__verb-flipping',
  title: 'Flipping',
  description: '3D flip rotation with perspective for each character.',
  disableReplay: false,
  tier: 3,
  props: [
    { type: 'string', name: 'text', label: 'Text', default: 'LOREM IPSUM DOLOR' },
    { type: 'color', name: 'color', label: 'Color', default: '#e8e4da' },
  ],
}
