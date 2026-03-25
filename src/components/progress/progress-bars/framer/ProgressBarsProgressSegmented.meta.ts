import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'progress-bars__progress-segmented',
  urlSlugFramer: '/progress-bars-framer?animation=progress-bars__progress-segmented',
  urlSlugCss: '/progress-bars-css?animation=progress-bars__progress-segmented',
  title: 'Segmented Sweep',
  description:
    'Segmented progress bar with glow on completion. Pass `progress` (0-1) for controlled mode. Optional `segments` prop. Style via --segmented-track-color, --segmented-fill-from/to, --segmented-height.',
  tier: 4,
  previewMaxWidth: 414,
  props: [
    {
      type: 'number',
      name: 'progress',
      label: 'Progress',
      default: 0.72,
      min: 0,
      max: 1,
      step: 0.01,
      animatable: true,
    },
    { type: 'number', name: 'segments', label: 'Segments', default: 4, min: 2, max: 12, step: 1 },
    {
      type: 'style-object',
      name: 'style',
      label: 'Theme',
      fields: [
        {
          type: 'color',
          key: '--segmented-track-bg',
          label: 'Track',
          default: 'rgb(255 255 255 / 8%)',
        },
        { type: 'color', key: '--segmented-fill-from', label: 'Fill Start', default: '#a78bfa' },
        { type: 'color', key: '--segmented-fill-to', label: 'Fill End', default: '#c4b5fd' },
        {
          type: 'color',
          key: '--segmented-segment-bg',
          label: 'Segment Overlay',
          default: 'rgb(167 139 250 / 6%)',
        },
        {
          type: 'number',
          key: '--segmented-height',
          label: 'Track Height',
          default: 14,
          min: 6,
          max: 32,
          step: 1,
          unit: 'px',
        },
      ],
    },
  ],
}
