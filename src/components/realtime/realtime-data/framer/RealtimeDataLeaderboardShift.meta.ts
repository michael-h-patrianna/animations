import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'realtime-data__leaderboard-shift',
  urlSlugFramer: '/realtime-data-framer?animation=realtime-data__leaderboard-shift',
  urlSlugCss: '/realtime-data-css?animation=realtime-data__leaderboard-shift',
  title: 'Leaderboard Shift',
  description:
    'Animated ranked list that cycles the top entry to the bottom with smooth position transitions. Configure items, duration, and pause timing.',
  tier: 3,
  tags: ['raf'],
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
    {
      type: 'number',
      name: 'pauseDuration',
      label: 'Pause Duration',
      default: 2000,
      min: 500,
      max: 5000,
      step: 100,
      unit: 'ms',
    },
  ],
} satisfies AnimationMetadata
