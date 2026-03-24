import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'prize-reveal__card-pack-open',
  urlSlugFramer: '/prize-reveal-framer?animation=prize-reveal__card-pack-open',
  urlSlugCss: '/prize-reveal-css?animation=prize-reveal__card-pack-open',
  title: 'Card Pack Open — Card Reveal',
  description:
    'Premium card pack descends, shakes with converging energy, splits open via clip-path — 5 collectible cards fan out face-down, then flip one by one with escalating rarity bursts (common → legendary).',
  disableReplay: false,
  controls: 'prizeCount',
  prizeCountMax: 5,
  props: [
    { type: 'number', name: 'prizeCount', label: 'Card Count', default: 5, min: 1, max: 5, step: 1 },
  ],
  tier: 4,
} satisfies AnimationMetadata
