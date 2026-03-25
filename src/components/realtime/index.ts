import {
  buildGroupFromExports,
  registerLazyCategory,
  registerLazyGroup,
} from '@/lib/lazyGroupRegistry'
import type { GroupMetadata } from '@/types/animation'

// ============================================================================
// Group Metadata (lightweight, eager-loaded for navigation)
// ============================================================================

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

// ============================================================================
// Lazy Loaders (heavy code split into separate chunks)
// ============================================================================

// Timer Effects
registerLazyGroup('timer-effects-framer', async () => {
  const { groupExport } = await import('./timer-effects')
  const group = buildGroupFromExports(
    groupExport.metadata,
    'framer',
    groupExport.framer,
    'realtime'
  )
  return { metadata: groupExport.metadata, animations: groupExport.framer, group }
})

registerLazyGroup('timer-effects-css', async () => {
  const { groupExport } = await import('./timer-effects')
  const group = buildGroupFromExports(groupExport.metadata, 'css', groupExport.css, 'realtime')
  return { metadata: groupExport.metadata, animations: groupExport.css, group }
})

// Update Indicators
registerLazyGroup('update-indicators-framer', async () => {
  const { groupExport } = await import('./update-indicators')
  const group = buildGroupFromExports(
    groupExport.metadata,
    'framer',
    groupExport.framer,
    'realtime'
  )
  return { metadata: groupExport.metadata, animations: groupExport.framer, group }
})

registerLazyGroup('update-indicators-css', async () => {
  const { groupExport } = await import('./update-indicators')
  const group = buildGroupFromExports(groupExport.metadata, 'css', groupExport.css, 'realtime')
  return { metadata: groupExport.metadata, animations: groupExport.css, group }
})

// Real-time Data
registerLazyGroup('realtime-data-framer', async () => {
  const { groupExport } = await import('./realtime-data')
  const group = buildGroupFromExports(
    groupExport.metadata,
    'framer',
    groupExport.framer,
    'realtime'
  )
  return { metadata: groupExport.metadata, animations: groupExport.framer, group }
})

registerLazyGroup('realtime-data-css', async () => {
  const { groupExport } = await import('./realtime-data')
  const group = buildGroupFromExports(groupExport.metadata, 'css', groupExport.css, 'realtime')
  return { metadata: groupExport.metadata, animations: groupExport.css, group }
})

// ============================================================================
// Navigation Registration
// ============================================================================

registerLazyCategory('realtime', 'Real-time Updates & Timers', [
  {
    id: 'timer-effects-framer',
    title: 'Timer Effects (Framer)',
    tech: 'framer',
    baseGroupId: 'timer-effects',
    animationIds: [],
    metadata: timerEffectsMeta,
  },
  {
    id: 'timer-effects-css',
    title: 'Timer Effects (CSS)',
    tech: 'css',
    baseGroupId: 'timer-effects',
    animationIds: [],
    metadata: timerEffectsMeta,
  },
  {
    id: 'update-indicators-framer',
    title: 'Update Indicators (Framer)',
    tech: 'framer',
    baseGroupId: 'update-indicators',
    animationIds: [],
    metadata: updateIndicatorsMeta,
  },
  {
    id: 'update-indicators-css',
    title: 'Update Indicators (CSS)',
    tech: 'css',
    baseGroupId: 'update-indicators',
    animationIds: [],
    metadata: updateIndicatorsMeta,
  },
  {
    id: 'realtime-data-framer',
    title: 'Real-time Data (Framer)',
    tech: 'framer',
    baseGroupId: 'realtime-data',
    animationIds: [],
    metadata: realtimeDataMeta,
  },
  {
    id: 'realtime-data-css',
    title: 'Real-time Data (CSS)',
    tech: 'css',
    baseGroupId: 'realtime-data',
    animationIds: [],
    metadata: realtimeDataMeta,
  },
])

// ============================================================================
// Legacy Compatibility Export
// ============================================================================

import type { CategoryExport, CategoryMetadata } from '@/types/animation'

export const categoryMetadata: CategoryMetadata = {
  id: 'realtime',
  title: 'Real-time Updates & Timers',
}

export const categoryExport: CategoryExport = {
  metadata: categoryMetadata,
  groups: {},
}
