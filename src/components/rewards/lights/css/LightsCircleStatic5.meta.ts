import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'lights__circle-static-5',
  urlSlugFramer: '/lights-framer?animation=lights__circle-static-5',
  urlSlugCss: '/lights-css?animation=lights__circle-static-5',
  title: 'Random Sparkle',
  description:
    'Unpredictable twinkling creates excitement and anticipation like stars in the night sky.',
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
