import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'text-effects__epic-win',
  urlSlugFramer: '/text-effects-framer?animation=text-effects__epic-win',
  urlSlugCss: '/text-effects-css?animation=text-effects__epic-win',
  title: 'Epic Win',
  description:
    'Metallic 3D text with rotating entrance, layered shadows, and victory flare effect.',
  disableReplay: false,
  tier: 3,
  props: [
    { type: 'string', name: 'text', label: 'Text', default: 'EPIC WIN' },
    { type: 'color', name: 'color', label: 'Color', default: '#ffd700' },
  ],
} satisfies AnimationMetadata
