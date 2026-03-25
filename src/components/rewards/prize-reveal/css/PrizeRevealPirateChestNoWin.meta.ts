import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'prize-reveal__pirate-chest-no-win',
  urlSlugFramer: '/prize-reveal-framer?animation=prize-reveal__pirate-chest-no-win',
  urlSlugCss: '/prize-reveal-css?animation=prize-reveal__pirate-chest-no-win',
  title: 'Pirate Chest Reveal (No Win)',
  description:
    'A closed chest rises and shakes before opening to an empty result with a subdued dim finish.',
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
  ],
}
