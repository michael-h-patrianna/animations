import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'text-effects__combo-counter',
  urlSlugFramer: '/text-effects-framer?animation=text-effects__combo-counter',
  urlSlugCss: '/text-effects-css?animation=text-effects__combo-counter',
  title: 'Combo Counter',
  description: 'Dynamic counting animation with milestone particles and perfect combo celebration.',
  disableReplay: false,
  tier: 4,
  tags: ['raf'],
  props: [
    { type: 'number', name: 'from', label: 'From', default: 0, min: 0, max: 1000, step: 1 },
    { type: 'number', name: 'to', label: 'To', default: 25, min: 1, max: 1000, step: 1 },
    { type: 'string', name: 'label', label: 'Label', default: 'COMBO' },
    { type: 'string', name: 'bonusText', label: 'Bonus Text', default: 'PERFECT!' },
    {
      type: 'string',
      name: 'formatValue',
      label: 'Format Value',
      disabled: true,
      disabledReason: 'Callback — pass a (n: number) => string function via props',
    },
    {
      type: 'number',
      name: 'maxParticles',
      label: 'Max Particles',
      default: 4,
      min: 1,
      max: 12,
      step: 1,
    },
    { type: 'color', name: 'numberColor', label: 'Number Color', default: '#ef4444' },
    { type: 'color', name: 'labelColor', label: 'Label Color', default: '#f59e0b' },
    { type: 'color', name: 'bonusColor', label: 'Bonus Color', default: '#ffd700' },
  ],
} satisfies AnimationMetadata
