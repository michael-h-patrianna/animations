import type { AnimationMetadata } from '@/types/animation'

export const metadata = {
  id: 'progress-bars__circular-dash',
  urlSlugFramer: '/progress-bars-framer?animation=progress-bars__circular-dash',
  urlSlugCss: '/progress-bars-css?animation=progress-bars__circular-dash',
  title: 'Circular Dash',
  description:
    'Circular segmented ring progress. Pass `progress` (0-1) for controlled mode. Optional `segments` prop. Style via --circular-dash-active, --circular-dash-inactive, --circular-dash-text, --circular-dash-size.',
  tier: 4,
  previewMaxWidth: 414,
} satisfies AnimationMetadata
