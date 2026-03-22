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
} satisfies AnimationMetadata
