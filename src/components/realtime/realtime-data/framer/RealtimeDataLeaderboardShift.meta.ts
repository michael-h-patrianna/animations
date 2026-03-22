import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'realtime-data__leaderboard-shift',
  urlSlugFramer: '/realtime-data-framer?animation=realtime-data__leaderboard-shift',
  urlSlugCss: '/realtime-data-css?animation=realtime-data__leaderboard-shift',
  title: 'Leaderboard Shift',
  description:
    'Animated ranked list that cycles the top entry to the bottom with smooth position transitions. Configure items, duration, and pause timing.',
  tier: 3,
} satisfies AnimationMetadata
