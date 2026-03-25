import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'progress-bars__elastic-fill',
  urlSlugFramer: '/progress-bars-framer?animation=progress-bars__elastic-fill',
  urlSlugCss: '/progress-bars-css?animation=progress-bars__elastic-fill',
  title: 'Elastic Fill',
  description:
    'Progress bar with elastic overshoot and squash physics. Pass `progress` (0-1) for controlled mode, or omit for demo. Style via --elastic-fill-track-color, --elastic-fill-from, --elastic-fill-to, --elastic-fill-height, --elastic-fill-radius.',
  tier: 2,
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
    {
      type: 'style-object',
      name: 'style',
      label: 'Theme',
      fields: [
        {
          type: 'color',
          key: '--elastic-fill-track-bg',
          label: 'Track',
          default: 'rgb(255 255 255 / 8%)',
        },
        { type: 'color', key: '--elastic-fill-from', label: 'Fill Start', default: '#f59e0b' },
        { type: 'color', key: '--elastic-fill-to', label: 'Fill End', default: '#fbbf24' },
        {
          type: 'number',
          key: '--elastic-fill-height',
          label: 'Track Height',
          default: 14,
          min: 6,
          max: 32,
          step: 1,
          unit: 'px',
        },
        {
          type: 'number',
          key: '--elastic-fill-radius',
          label: 'Corner Radius',
          default: 999,
          min: 0,
          max: 999,
          step: 1,
          unit: 'px',
        },
      ],
    },
  ],
}
