import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'realtime-data__leaderboard-shift',
  urlSlugFramer: '/realtime-data-framer?animation=realtime-data__leaderboard-shift',
  urlSlugCss: '/realtime-data-css?animation=realtime-data__leaderboard-shift',
  title: 'Leaderboard Shift',
  description:
    'Reactive ranked list that animates position transitions when items change. Pass updated items to trigger smooth exit, shift, and entry animations.',
  tier: 3,
  tags: ['raf'],
  demoMode: 'list-rotate',
  props: [
    {
      type: 'string',
      name: 'items',
      label: 'Items',
      disabled: true,
      disabledReason: 'RankedEntry[] — set via code',
    },
    {
      type: 'number',
      name: 'duration',
      label: 'Duration',
      default: 800,
      min: 200,
      max: 3000,
      step: 100,
      unit: 'ms',
    },
  ],
} satisfies AnimationMetadata
