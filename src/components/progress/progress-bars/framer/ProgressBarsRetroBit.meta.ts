import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'progress-bars__retro-bit',
  urlSlugFramer: '/progress-bars-framer?animation=progress-bars__retro-bit',
  urlSlugCss: '/progress-bars-css?animation=progress-bars__retro-bit',
  title: 'Retro Bit',
  description:
    '8-bit segmented progress bar. Pass `progress` (0-1) for controlled mode. Optional `segments` and `label` props. Style via --retro-bit-bg, --retro-bit-active, --retro-bit-inactive, --retro-bit-label-color.',
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
    { type: 'number', name: 'segments', label: 'Segments', default: 10, min: 2, max: 20, step: 1 },
    { type: 'string', name: 'label', label: 'Label', default: 'LOADING...' },
    {
      type: 'style-object',
      name: 'style',
      label: 'Theme',
      fields: [
        { type: 'color', key: '--retro-bit-bg', label: 'Background', default: '#050505' },
        { type: 'color', key: '--retro-bit-active', label: 'Active Segment', default: '#4ade80' },
        {
          type: 'color',
          key: '--retro-bit-inactive',
          label: 'Inactive Segment',
          default: 'rgb(22 101 52 / 20%)',
        },
        { type: 'color', key: '--retro-bit-label-color', label: 'Label Text', default: '#4ade80' },
      ],
    },
  ],
} satisfies AnimationMetadata
