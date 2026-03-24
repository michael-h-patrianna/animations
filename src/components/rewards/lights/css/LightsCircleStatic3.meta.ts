import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'lights__circle-static-3',
  urlSlugFramer: '/lights-framer?animation=lights__circle-static-3',
  urlSlugCss: '/lights-css?animation=lights__circle-static-3',
  title: 'Accelerating Spin',
  description:
    'Wheel of fortune spin: starts slow, accelerates to blur, decelerates, and settles on winner with celebration.',
  controls: 'lights',
  infinite: true,
  tier: 3,
  props: [
    {
      type: 'number',
      name: 'numBulbs',
      label: 'Number of Bulbs',
      default: 16,
      min: 4,
      max: 40,
      step: 1,
    },
    { type: 'color', name: 'onColor', label: 'Bulb Color', default: 'var(--pf-anim-gold)' },
  ],
}
