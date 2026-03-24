import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'button-effects__split-reveal',
  title: 'Split Reveal',
  description:
    'Button text splits apart to reveal hidden content. Props: topLabel, bottomLabel, revealContent, duration, className, onClick.',
  disableReplay: true,
  tier: 2,
  props: [
    {
      type: 'number',
      name: 'duration',
      label: 'Duration',
      default: 800,
      min: 200,
      max: 3000,
      step: 50,
      unit: 'ms',
    },
    {
      type: 'string',
      name: 'topLabel',
      label: 'Top Label',
      disabled: true,
      disabledReason: 'Pass ReactNode via topLabel prop',
    },
    {
      type: 'string',
      name: 'bottomLabel',
      label: 'Bottom Label',
      disabled: true,
      disabledReason: 'Pass ReactNode via bottomLabel prop',
    },
    {
      type: 'string',
      name: 'revealContent',
      label: 'Reveal Content',
      disabled: true,
      disabledReason: 'Pass ReactNode via revealContent prop',
    },
    {
      type: 'string',
      name: 'onClick',
      label: 'On Click',
      disabled: true,
      disabledReason: 'Pass callback via onClick prop',
    },
  ],
}
