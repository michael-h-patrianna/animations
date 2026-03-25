import {
  buildGroupFromExports,
  registerLazyCategory,
  registerLazyGroup,
} from '@/lib/lazyGroupRegistry'
import type { GroupMetadata } from '@/types/animation'

// ============================================================================
// Group Metadata (lightweight, eager-loaded for navigation)
// ============================================================================

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

// ============================================================================
// Lazy Loaders (heavy code split into separate chunks)
// ============================================================================

// Progress Bars
registerLazyGroup('progress-bars-framer', async () => {
  const { groupExport } = await import('./progress-bars')
  const group = buildGroupFromExports(
    groupExport.metadata,
    'framer',
    groupExport.framer,
    'progress'
  )
  return { metadata: groupExport.metadata, animations: groupExport.framer, group }
})

registerLazyGroup('progress-bars-css', async () => {
  const { groupExport } = await import('./progress-bars')
  const group = buildGroupFromExports(groupExport.metadata, 'css', groupExport.css, 'progress')
  return { metadata: groupExport.metadata, animations: groupExport.css, group }
})

// Loading States
registerLazyGroup('loading-states-framer', async () => {
  const { groupExport } = await import('./loading-states')
  const group = buildGroupFromExports(
    groupExport.metadata,
    'framer',
    groupExport.framer,
    'progress'
  )
  return { metadata: groupExport.metadata, animations: groupExport.framer, group }
})

registerLazyGroup('loading-states-css', async () => {
  const { groupExport } = await import('./loading-states')
  const group = buildGroupFromExports(groupExport.metadata, 'css', groupExport.css, 'progress')
  return { metadata: groupExport.metadata, animations: groupExport.css, group }
})

// ============================================================================
// Navigation Registration
// ============================================================================

registerLazyCategory('progress', 'Progress & Loading Animations', [
  {
    id: 'progress-bars-framer',
    title: 'Progress Bars (Framer)',
    tech: 'framer',
    baseGroupId: 'progress-bars',
    animationIds: [],
    metadata: progressBarsMeta,
  },
  {
    id: 'progress-bars-css',
    title: 'Progress Bars (CSS)',
    tech: 'css',
    baseGroupId: 'progress-bars',
    animationIds: [],
    metadata: progressBarsMeta,
  },
  {
    id: 'loading-states-framer',
    title: 'Loading States (Framer)',
    tech: 'framer',
    baseGroupId: 'loading-states',
    animationIds: [],
    metadata: loadingStatesMeta,
  },
  {
    id: 'loading-states-css',
    title: 'Loading States (CSS)',
    tech: 'css',
    baseGroupId: 'loading-states',
    animationIds: [],
    metadata: loadingStatesMeta,
  },
])

// ============================================================================
// Legacy Compatibility Export
// ============================================================================

import type { CategoryExport, CategoryMetadata } from '@/types/animation'

export const categoryMetadata: CategoryMetadata = {
  id: 'progress',
  title: 'Progress & Loading Animations',
}

export const categoryExport: CategoryExport = {
  metadata: categoryMetadata,
  groups: {},
}
