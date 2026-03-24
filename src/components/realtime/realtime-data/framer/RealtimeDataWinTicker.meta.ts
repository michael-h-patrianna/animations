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
  props: [
    {
      type: 'string',
      name: 'items',
      label: 'Items',
      disabled: true,
      disabledReason: 'string[] — set via code',
    },
    { type: 'string', name: 'separator', label: 'Separator', default: ' · ' },
    {
      type: 'number',
      name: 'duration',
      label: 'Duration',
      default: 8000,
      min: 2000,
      max: 20000,
      step: 500,
      unit: 'ms',
    },
    { type: 'color', name: 'textColor', label: 'Text Color', default: '#f59e0b' },
  ],
} satisfies AnimationMetadata
