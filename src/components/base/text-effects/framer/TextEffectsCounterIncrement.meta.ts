import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'text-effects__counter-increment',
  urlSlugFramer: '/text-effects-framer?animation=text-effects__counter-increment',
  urlSlugCss: '/text-effects-css?animation=text-effects__counter-increment',
  title: 'Counter Increment',
  description: 'Numeric counter ticks upwards with scale.',
  disableReplay: false,
  tier: 4,
  props: [
    { type: 'number', name: 'from', label: 'From', default: 0, min: 0, max: 10000, step: 1 },
    { type: 'number', name: 'to', label: 'To', min: 1, max: 10000, step: 1 },
    { type: 'string', name: 'prefix', label: 'Prefix' },
    { type: 'string', name: 'suffix', label: 'Suffix' },
    { type: 'string', name: 'formatValue', label: 'Format Value', disabled: true, disabledReason: 'Callback — pass a (n: number) => string function via props' },
    { type: 'number', name: 'incrementValue', label: 'Increment Value', default: 1, min: 1, max: 100, step: 1 },
    { type: 'number', name: 'intervalMs', label: 'Interval', default: 2000, min: 500, max: 10000, step: 100, unit: 'ms' },
    { type: 'number', name: 'maxParticles', label: 'Max Particles', default: 8, min: 1, max: 20, step: 1 },
    { type: 'number', name: 'durationMs', label: 'Duration', default: 3000, min: 500, max: 10000, step: 100, unit: 'ms' },
    { type: 'color', name: 'color', label: 'Color', default: '#c6ff77' },
  ],
} satisfies AnimationMetadata
