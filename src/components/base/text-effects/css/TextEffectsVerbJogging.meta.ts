import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'text-effects__verb-jogging',
  urlSlugFramer: '/text-effects-framer?animation=text-effects__verb-jogging',
  urlSlugCss: '/text-effects-css?animation=text-effects__verb-jogging',
  title: 'Jogging',
  description: 'Energetic jog rhythm alternating between letters.',
  disableReplay: false,
  infinite: true,
  tier: 3,
  props: [
    { type: 'string', name: 'text', label: 'Text', default: 'LOREM IPSUM DOLOR' },
    { type: 'color', name: 'color', label: 'Color', default: '#e8e4da' },
  ],
}
