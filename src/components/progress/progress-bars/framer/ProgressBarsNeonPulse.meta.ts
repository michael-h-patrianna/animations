import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'progress-bars__neon-pulse',
  urlSlugFramer: '/progress-bars-framer?animation=progress-bars__neon-pulse',
  urlSlugCss: '/progress-bars-css?animation=progress-bars__neon-pulse',
  title: 'Neon Pulse',
  description:
    'Cyberpunk neon progress bar with flicker and glow. Pass `progress` (0-1) for controlled mode. Optional `label` prop. Style via --neon-pulse-bg, --neon-pulse-track, --neon-pulse-fill, --neon-pulse-flicker, --neon-pulse-glow, --neon-pulse-height.',
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
    },
    { type: 'string', name: 'label', label: 'Label', default: 'SYNCING...' },
    {
      type: 'style-object',
      name: 'style',
      label: 'Theme',
      fields: [
        { type: 'color', key: '--neon-pulse-bg', label: 'Background', default: '#0a0a0f' },
        {
          type: 'color',
          key: '--neon-pulse-track',
          label: 'Track',
          default: 'rgb(236 72 153 / 8%)',
        },
        { type: 'color', key: '--neon-pulse-fill', label: 'Fill Start', default: '#ec4899' },
        { type: 'color', key: '--neon-pulse-fill-to', label: 'Fill End', default: '#f472b6' },
        {
          type: 'color',
          key: '--neon-pulse-glow',
          label: 'Glow',
          default: 'rgb(236 72 153 / 25%)',
        },
        {
          type: 'number',
          key: '--neon-pulse-height',
          label: 'Track Height',
          default: 8,
          min: 4,
          max: 24,
          step: 1,
          unit: 'px',
        },
      ],
    },
  ],
} satisfies AnimationMetadata
