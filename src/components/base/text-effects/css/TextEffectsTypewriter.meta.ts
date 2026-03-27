import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'text-effects__typewriter',
  urlSlugFramer: '/text-effects-framer?animation=text-effects__typewriter',
  urlSlugCss: '/text-effects-css?animation=text-effects__typewriter',
  title: 'Typewriter',
  description: 'Classic terminal-style text typing with blinking cursor for system messages.',
  disableReplay: false,
  tier: 3,
  tags: [],
  props: [
    { type: 'string', name: 'text', label: 'Text', default: 'LOADING SYSTEM...' },
    {
      type: 'number',
      name: 'charDelay',
      label: 'Char Delay',
      default: 0.08,
      min: 0.01,
      max: 0.3,
      step: 0.01,
      unit: 's',
    },
    { type: 'string', name: 'cursor', label: 'Cursor', default: '|' },
    { type: 'color', name: 'color', label: 'Color', default: '#10b981' },
  ],
}
