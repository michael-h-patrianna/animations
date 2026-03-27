import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'realtime-data__live-score-update',
  urlSlugFramer: '/realtime-data-framer?animation=realtime-data__live-score-update',
  urlSlugCss: '/realtime-data-css?animation=realtime-data__live-score-update',
  title: 'Live Score Update',
  description:
    'Reactive score display that counts up with an eased scale+color pulse when items change. Pass updated scores to trigger animation.',
  infinite: true,
  tier: 3,
  demoMode: 'score-pulse',
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
      type: 'color',
      name: 'highlightColor',
      label: 'Highlight Color',
      default: 'var(--pf-anim-green)',
    },
  ],
} satisfies AnimationMetadata
