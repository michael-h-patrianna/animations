import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'realtime-data__stacked-realtime',
  urlSlugFramer: '/realtime-data-framer?animation=realtime-data__stacked-realtime',
  urlSlugCss: '/realtime-data-css?animation=realtime-data__stacked-realtime',
  title: 'Stacked Pulse',
  description:
    'Key-value rows that slide in with alternating directions and staggered timing. Configure items, stagger delay, duration, and active/inactive colors.',
  tier: 3,
  props: [
    {
      type: 'string',
      name: 'items',
      label: 'Items',
      disabled: true,
      disabledReason: 'StatEntry[] — set via code',
    },
    {
      type: 'number',
      name: 'staggerDelay',
      label: 'Stagger Delay',
      default: 80,
      min: 20,
      max: 300,
      step: 10,
      unit: 'ms',
    },
    {
      type: 'number',
      name: 'duration',
      label: 'Duration',
      default: 600,
      min: 200,
      max: 2000,
      step: 100,
      unit: 'ms',
    },
    { type: 'color', name: 'activeColor', label: 'Active Color', default: 'var(--pf-anim-cyan)' },
    {
      type: 'color',
      name: 'inactiveColor',
      label: 'Inactive Color',
      default: 'var(--pf-anim-gray-400)',
    },
  ],
} satisfies AnimationMetadata
