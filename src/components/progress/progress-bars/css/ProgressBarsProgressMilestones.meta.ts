import type { AnimationMetadata } from '@/types/animation'

export const metadata: AnimationMetadata = {
  id: 'progress-bars__progress-milestones',
  urlSlugFramer: '/progress-bars-framer?animation=progress-bars__progress-milestones',
  urlSlugCss: '/progress-bars-css?animation=progress-bars__progress-milestones',
  title: 'Milestone Markers',
  description:
    'Milestone progress bar with diamond markers and ring pulse effects. Pass `progress` (0-1) and `milestones` array for controlled mode. Style via --milestone-track-color, --milestone-fill-from/to, --milestone-marker-color, --milestone-active-color.',
  tier: 4,
  previewMaxWidth: 414,
}
