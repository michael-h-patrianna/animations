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
} satisfies AnimationMetadata
