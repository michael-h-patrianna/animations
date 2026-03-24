import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'prize-reveal__chest-gc-sc',
  urlSlugFramer: '/prize-reveal-framer?animation=prize-reveal__chest-gc-sc',
  urlSlugCss: '/prize-reveal-css?animation=prize-reveal__chest-gc-sc',
  title: 'Chest GC & SC Prize Reveal',
  description:
    'Pirate chest rises, shakes, opens — Gold Coins and Sweepstake Coins fly out with prize rays and amount text.',
  controls: 'prizeCount',
  props: [
    { type: 'number', name: 'prizeCount', label: 'Prize Count', default: 3, min: 1, max: 4, step: 1 },
  ],
  tier: 4,
} satisfies AnimationMetadata
