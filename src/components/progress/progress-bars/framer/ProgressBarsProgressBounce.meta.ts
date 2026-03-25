import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'progress-bars__progress-bounce',
  urlSlugFramer: '/progress-bars-framer?animation=progress-bars__progress-bounce',
  urlSlugCss: '/progress-bars-css?animation=progress-bars__progress-bounce',
  title: 'Grow up',
  description:
    'Bounce-fill bar with overshoot, track deformation, impact waves, and celebration particles. Pass `progress` (0-1) for controlled mode. Style via --bounce-track-color, --bounce-fill-from/to, --bounce-height.',
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
    {
      type: 'style-object',
      name: 'style',
      label: 'Theme',
      fields: [
        {
          type: 'color',
          key: '--bounce-track-bg',
          label: 'Track',
          default: 'rgb(255 255 255 / 8%)',
        },
        { type: 'color', key: '--bounce-fill-from', label: 'Fill Start', default: '#34d399' },
        { type: 'color', key: '--bounce-fill-to', label: 'Fill End', default: '#6ee7b7' },
        { type: 'color', key: '--bounce-accent', label: 'Accent', default: '#34d399' },
        {
          type: 'number',
          key: '--bounce-height',
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
