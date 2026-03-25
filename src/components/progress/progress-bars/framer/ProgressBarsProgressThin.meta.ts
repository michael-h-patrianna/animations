import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'progress-bars__progress-thin',
  urlSlugFramer: '/progress-bars-framer?animation=progress-bars__progress-thin',
  urlSlugCss: '/progress-bars-css?animation=progress-bars__progress-thin',
  title: 'Thin Glide',
  description:
    'Ultra-thin progress line with photon trail and pulse effects. Pass `progress` (0-1) for controlled mode. Optional `label` prop. Style via --thin-label-color, --thin-track-color, --thin-fill-from/via/to, --thin-accent.',
  tier: 3,
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
    { type: 'string', name: 'label', label: 'Label', default: 'Level progress' },
    {
      type: 'style-object',
      name: 'style',
      label: 'Theme',
      fields: [
        {
          type: 'color',
          key: '--thin-label-color',
          label: 'Label Text',
          default: 'rgb(255 255 255 / 55%)',
        },
        { type: 'color', key: '--thin-track-bg', label: 'Track', default: 'rgb(255 255 255 / 6%)' },
        { type: 'color', key: '--thin-fill-from', label: 'Fill Start', default: '#38bdf8' },
        { type: 'color', key: '--thin-fill-via', label: 'Fill Middle', default: '#7dd3fc' },
        { type: 'color', key: '--thin-fill-to', label: 'Fill End', default: '#bae6fd' },
        { type: 'color', key: '--thin-accent', label: 'Accent', default: '#38bdf8' },
      ],
    },
  ],
}
