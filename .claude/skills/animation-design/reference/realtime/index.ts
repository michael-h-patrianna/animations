import type { CategoryExport, CategoryMetadata } from '@/types/animation'
import { groupExport as timerEffectsGroup } from './timer-effects'
import { groupExport as updateIndicatorsGroup } from './update-indicators'
import { groupExport as realtimeDataGroup } from './realtime-data'

export const categoryMetadata: CategoryMetadata = {
  id: 'realtime',
  title: 'Real-time Updates & Timers',
}

export const categoryExport: CategoryExport = {
  metadata: categoryMetadata,
  groups: {
    'timer-effects': timerEffectsGroup,
    'update-indicators': updateIndicatorsGroup,
    'realtime-data': realtimeDataGroup,
  }
}
