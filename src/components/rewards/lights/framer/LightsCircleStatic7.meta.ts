import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'lights__circle-static-7',
  urlSlugFramer: '/lights-framer?animation=lights__circle-static-7',
  urlSlugCss: '/lights-css?animation=lights__circle-static-7',
  title: 'Comet Trail',
  description:
    'A bright head with a long trailing fadeout creates a comet-like effect around the circle.',
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
