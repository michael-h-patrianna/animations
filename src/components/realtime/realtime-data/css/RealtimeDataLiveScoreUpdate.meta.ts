import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'realtime-data__live-score-update',
  urlSlugFramer: '/realtime-data-framer?animation=realtime-data__live-score-update',
  urlSlugCss: '/realtime-data-css?animation=realtime-data__live-score-update',
  title: 'Live Score Update',
  description:
    'Score rows that count up with an eased scale+color pulse. Configure items, increment, highlight color, and timing.',
  infinite: true,
  tier: 3,
} satisfies AnimationMetadata
