import { declareCategoryGroups } from '@/lib/lazyGroupRegistry'
import type { GroupMetadata } from '@/types/animation'

const progressBarsMeta: GroupMetadata = {
  id: 'progress-bars',
  title: 'Progress bars',
  demo: 'progressBars',
}

const loadingStatesMeta: GroupMetadata = {
  id: 'loading-states',
  title: 'Loading states',
  demo: 'loadingStates',
}

declareCategoryGroups('progress', 'Progress & Loading Animations', [
  { metadata: progressBarsMeta, load: () => import('./progress-bars') },
  { metadata: loadingStatesMeta, load: () => import('./loading-states') },
])
