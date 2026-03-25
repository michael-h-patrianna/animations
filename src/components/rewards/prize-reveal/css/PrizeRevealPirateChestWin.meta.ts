import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'prize-reveal__pirate-chest-win',
  urlSlugFramer: '/prize-reveal-framer?animation=prize-reveal__pirate-chest-win',
  urlSlugCss: '/prize-reveal-css?animation=prize-reveal__pirate-chest-win',
  title: 'Pirate Chest Reveal (Win)',
  description:
    'A closed chest rises, shakes with anticipation, then opens into a coin fountain burst.',
  tier: 4,
  props: [
    {
      type: 'number',
      name: 'shakeDelayMs',
      label: 'Shake Delay',
      default: 900,
      min: 0,
      max: 3000,
      step: 50,
      unit: 'ms',
    },
    {
      type: 'number',
      name: 'revealDelayMs',
      label: 'Reveal Delay',
      default: 1500,
      min: 0,
      max: 4000,
      step: 50,
      unit: 'ms',
    },
    {
      type: 'number',
      name: 'coinCount',
      label: 'Coin Count',
      default: 12,
      min: 1,
      max: 24,
      step: 1,
    },
  ],
}
