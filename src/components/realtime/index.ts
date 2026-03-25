import { declareCategoryGroups } from '@/lib/lazyGroupRegistry'
import type { GroupMetadata } from '@/types/animation'

const timerEffectsMeta: GroupMetadata = {
  id: 'timer-effects',
  title: 'Timer effects',
  demo: 'timerEffects',
}

const updateIndicatorsMeta: GroupMetadata = {
  id: 'update-indicators',
  title: 'Update indicators',
  demo: 'updateIndicators',
}

const realtimeDataMeta: GroupMetadata = {
  id: 'realtime-data',
  title: 'Realtime data',
  demo: 'realtimeData',
}

declareCategoryGroups('realtime', 'Real-time Updates & Timers', [
  { metadata: timerEffectsMeta, load: () => import('./timer-effects') },
  { metadata: updateIndicatorsMeta, load: () => import('./update-indicators') },
  { metadata: realtimeDataMeta, load: () => import('./realtime-data') },
])
