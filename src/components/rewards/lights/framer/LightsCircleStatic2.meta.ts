import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'lights__circle-static-2',
  urlSlugFramer: '/lights-framer?animation=lights__circle-static-2',
  urlSlugCss: '/lights-css?animation=lights__circle-static-2',
  title: 'Sequential Chase',
  description: 'Single lit bulb chases around the circle creating a smooth rotating motion effect.',
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
