import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'prize-reveal__arcane-portal',
  urlSlugFramer: '/prize-reveal-framer?animation=prize-reveal__arcane-portal',
  urlSlugCss: '/prize-reveal-css?animation=prize-reveal__arcane-portal',
  title: 'Arcane Portal Prize Reveal',
  description:
    'Mystical portal ring materializes, charges with arcane energy, then erupts — prizes emerge from the vortex with ethereal glow trails.',
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
