import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'realtime-data__win-ticker',
  urlSlugFramer: '/realtime-data-framer?animation=realtime-data__win-ticker',
  urlSlugCss: '/realtime-data-css?animation=realtime-data__win-ticker',
  title: 'Win Ticker',
  description:
    'Scrolling marquee for announcements or status messages. Configure items, separator, scroll speed, and text color.',
  infinite: true,
  tier: 4,
} satisfies AnimationMetadata
