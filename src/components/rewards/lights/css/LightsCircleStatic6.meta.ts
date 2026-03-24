import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'lights__circle-static-6',
  urlSlugFramer: '/lights-framer?animation=lights__circle-static-6',
  urlSlugCss: '/lights-css?animation=lights__circle-static-6',
  title: 'Carnival Waltz',
  description:
    'Musical waltz pattern with groups of 3 bulbs following strong-weak-weak rhythm, like carnival organ music.',
  controls: 'lights',
  infinite: true,
  tier: 3,
  props: [
    { type: 'number', name: 'numBulbs', label: 'Number of Bulbs', default: 16, min: 4, max: 40, step: 1 },
    { type: 'color', name: 'onColor', label: 'Bulb Color', default: 'var(--pf-anim-gold)' },
  ],
}
