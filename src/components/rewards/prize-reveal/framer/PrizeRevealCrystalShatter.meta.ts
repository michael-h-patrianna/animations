import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'prize-reveal__crystal-shatter',
  urlSlugFramer: '/prize-reveal-framer?animation=prize-reveal__crystal-shatter',
  urlSlugCss: '/prize-reveal-css?animation=prize-reveal__crystal-shatter',
  title: 'Crystal Shatter Prize Reveal',
  description:
    'Luminous crystal descends from above, charges with converging energy, then shatters — prizes emerge from the fragments with prismatic crystalline frames.',
  controls: 'prizeCount',
  props: [
    {
      type: 'number',
      name: 'prizeCount',
      label: 'Prize Count',
      default: 3,
      min: 1,
      max: 4,
      step: 1,
    },
  ],
  tier: 4,
} satisfies AnimationMetadata
