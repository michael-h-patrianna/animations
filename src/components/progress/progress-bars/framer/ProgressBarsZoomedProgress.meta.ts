import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'progress-bars__zoomed-progress',
  urlSlugFramer: '/progress-bars-framer?animation=progress-bars__zoomed-progress',
  urlSlugCss: '/progress-bars-css?animation=progress-bars__zoomed-progress',
  title: 'Zoomed Progress',
  description:
    'Multi-level progress bar with zoomed viewport that shifts and scales as levels advance. Features numbered milestones, color transitions per level (blue to yellow to pink), radial gradient masking for zoom effect, and skewed progress fill animation.',
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
    {
      type: 'style-object',
      name: 'style',
      label: 'Theme',
      fields: [
        {
          type: 'color',
          key: '--progress-bars-zoomed-progress-bg-1',
          label: 'Track',
          default: 'rgb(78 24 124 / 15%)',
        },
        {
          type: 'color',
          key: '--progress-bars-zoomed-progress-border-1',
          label: 'Ring Border',
          default: 'rgb(255 255 255 / 90%)',
        },
        {
          type: 'color',
          key: '--progress-bars-zoomed-progress-bg-2',
          label: 'Level One Active',
          default: '#c6ff77',
        },
        {
          type: 'color',
          key: '--progress-bars-zoomed-progress-bg-3',
          label: 'Level Two Active',
          default: '#d4ff9f',
        },
        {
          type: 'color',
          key: '--progress-bars-zoomed-progress-color-1',
          label: 'Level Text',
          default: 'rgb(78 24 124 / 50%)',
        },
      ],
    },
  ],
}
