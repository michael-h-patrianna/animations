import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'lights__circle-static-8',
  urlSlugFramer: '/lights-framer?animation=lights__circle-static-8',
  urlSlugCss: '/lights-css?animation=lights__circle-static-8',
  title: 'Dual Convergence',
  description: 'Two lights chase from opposite sides, meeting with a dramatic collision flash.',
  controls: 'lights',
  infinite: true,
  tier: 3,
  props: [
    { type: 'number', name: 'numBulbs', label: 'Number of Bulbs', default: 16, min: 4, max: 40, step: 1 },
    { type: 'color', name: 'onColor', label: 'Bulb Color', default: 'var(--pf-anim-gold)' },
  ],
}
