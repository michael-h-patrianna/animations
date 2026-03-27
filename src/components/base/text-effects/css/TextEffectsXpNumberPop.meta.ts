import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'text-effects__xp-number-pop',
  urlSlugFramer: '/text-effects-framer?animation=text-effects__xp-number-pop',
  urlSlugCss: '/text-effects-css?animation=text-effects__xp-number-pop',
  title: 'XP Number Pop',
  description: 'XP gain count-up with pop easing, glow orb, and particle effects.',
  disableReplay: false,
  tier: 4,
  tags: ['raf'],
  props: [
    { type: 'number', name: 'from', label: 'From', default: 0, min: 0, max: 10000, step: 1 },
    { type: 'number', name: 'to', label: 'To', default: 240, min: 1, max: 10000, step: 1 },
    { type: 'string', name: 'prefix', label: 'Prefix' },
    { type: 'string', name: 'suffix', label: 'Suffix', default: ' XP' },
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
      default: 10,
      min: 1,
      max: 20,
      step: 1,
    },
    { type: 'color', name: 'color', label: 'Color', default: '#c6ff77' },
  ],
}
