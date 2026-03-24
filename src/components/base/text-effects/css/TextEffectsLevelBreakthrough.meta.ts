import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'text-effects__level-breakthrough',
  urlSlugFramer: '/text-effects-framer?animation=text-effects__level-breakthrough',
  urlSlugCss: '/text-effects-css?animation=text-effects__level-breakthrough',
  title: 'Level Breakthrough',
  description: 'Level breakthrough shakes frame with surge lines explosion effect.',
  disableReplay: false,
  tier: 4,
  props: [
    { type: 'string', name: 'startText', label: 'Start Text', default: 'LEVEL 1' },
    { type: 'string', name: 'endText', label: 'End Text', default: 'LEVEL 2' },
    { type: 'color', name: 'color', label: 'Color', default: '#ffce1a' },
  ],
}
