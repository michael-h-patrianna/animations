import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'progress-bars__sci-fi-loader',
  urlSlugFramer: '/progress-bars-framer?animation=progress-bars__sci-fi-loader',
  urlSlugCss: '/progress-bars-css?animation=progress-bars__sci-fi-loader',
  title: 'Sci-Fi Loader',
  description:
    'Futuristic skewed progress bar with glint sweep. Pass `progress` (0-1) for controlled mode. Optional `label` prop. Style via --scifi-bg, --scifi-fill, --scifi-accent, --scifi-text.',
  tier: 4,
  tags: [],
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
    { type: 'string', name: 'label', label: 'Label', default: 'SYSTEM.INIT:' },
    {
      type: 'style-object',
      name: 'style',
      label: 'Theme',
      fields: [
        { type: 'color', key: '--scifi-bg', label: 'Background', default: '#0f172a' },
        { type: 'color', key: '--scifi-track', label: 'Track', default: 'rgb(56 189 248 / 6%)' },
        { type: 'color', key: '--scifi-fill', label: 'Fill', default: '#0ea5e9' },
        { type: 'color', key: '--scifi-accent', label: 'Accent', default: '#38bdf8' },
        { type: 'color', key: '--scifi-text', label: 'Text', default: '#38bdf8' },
      ],
    },
  ],
} satisfies AnimationMetadata
