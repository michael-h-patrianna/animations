import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'lights__circle-static-1',
  urlSlugFramer: '/lights-framer?animation=lights__circle-static-1',
  urlSlugCss: '/lights-css?animation=lights__circle-static-1',
  title: 'Alternating Carnival',
  description:
    'Classic carnival pattern with even/odd bulbs alternating on and off with realistic glow and fadeout.',
  controls: 'lights',
  infinite: true,
  tier: 3,
  props: [
    { type: 'number', name: 'numBulbs', label: 'Number of Bulbs', default: 16, min: 4, max: 40, step: 1 },
    { type: 'color', name: 'onColor', label: 'Bulb Color', default: 'var(--pf-anim-gold)' },
  ],
}
