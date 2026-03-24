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
      name: 'increment',
      label: 'Increment',
      default: 120,
      min: 10,
      max: 1000,
      step: 10,
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
      type: 'color',
      name: 'highlightColor',
      label: 'Highlight Color',
      default: 'var(--pf-anim-green)',
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
