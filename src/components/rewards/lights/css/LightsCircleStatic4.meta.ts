import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'lights__circle-static-4',
  urlSlugFramer: '/lights-framer?animation=lights__circle-static-4',
  urlSlugCss: '/lights-css?animation=lights__circle-static-4',
  title: 'Reverse Chase Pulse',
  description:
    'Counter-clockwise chase followed by faster clockwise motion, then synchronized pulses before revealing the winner.',
  controls: 'lights',
  infinite: true,
  tier: 3,
  props: [
    { type: 'number', name: 'numBulbs', label: 'Number of Bulbs', default: 16, min: 4, max: 40, step: 1 },
    { type: 'color', name: 'onColor', label: 'Bulb Color', default: 'var(--pf-anim-gold)' },
  ],
}
