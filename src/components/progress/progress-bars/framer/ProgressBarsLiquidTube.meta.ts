import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'progress-bars__liquid-tube',
  urlSlugFramer: '/progress-bars-framer?animation=progress-bars__liquid-tube',
  urlSlugCss: '/progress-bars-css?animation=progress-bars__liquid-tube',
  title: 'Liquid Tube',
  description:
    'Vertical liquid tube with wave surface and rising bubbles. Pass `progress` (0-1) for controlled mode. Style via --liquid-tube-border, --liquid-tube-bg, --liquid-tube-fill, --liquid-tube-bubble.',
  tier: 4,
  tags: ['lrc'],
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
          key: '--liquid-tube-glass-bg',
          label: 'Glass Background',
          default: 'rgb(255 255 255 / 4%)',
        },
        {
          type: 'color',
          key: '--liquid-tube-glass-border',
          label: 'Glass Border',
          default: 'rgb(255 255 255 / 12%)',
        },
        { type: 'color', key: '--liquid-tube-fill', label: 'Liquid Fill', default: '#60a5fa' },
        {
          type: 'color',
          key: '--liquid-tube-bubble',
          label: 'Bubble Color',
          default: 'rgb(255 255 255 / 25%)',
        },
      ],
    },
  ],
} satisfies AnimationMetadata
