import {
  buildGroupFromExports,
  registerLazyCategory,
  registerLazyGroup,
} from '@/lib/lazyGroupRegistry'
import type { GroupMetadata } from '@/types/animation'

// ============================================================================
// Group Metadata (lightweight, eager-loaded for navigation)
// ============================================================================

const modalBaseMeta: GroupMetadata = {
  id: 'modal-base',
  title: 'Base modal animations',
  demo: 'modalBaseFramer',
}

const modalContentMeta: GroupMetadata = {
  id: 'modal-content',
  title: 'Content choreography',
  demo: 'modalContentFramer',
}

const modalDismissMeta: GroupMetadata = {
  id: 'modal-dismiss',
  title: 'Auto-dismiss patterns',
  demo: 'modalDismissFramer',
}

const modalOpenMeta: GroupMetadata = {
  id: 'modal-open',
  title: 'Modal open',
  demo: 'modalOpenFramer',
}

const modalOrchestrationMeta: GroupMetadata = {
  id: 'modal-orchestration',
  title: 'Tile animations',
  demo: 'modalOrchestrationFramer',
}

// ============================================================================
// Lazy Loaders (heavy code split into separate chunks)
// ============================================================================

// Modal Base
registerLazyGroup('modal-base-framer', async () => {
  const { groupExport } = await import('./modal-base')
  const group = buildGroupFromExports(groupExport.metadata, 'framer', groupExport.framer, 'dialogs')
  return { metadata: groupExport.metadata, animations: groupExport.framer, group }
})

registerLazyGroup('modal-base-css', async () => {
  const { groupExport } = await import('./modal-base')
  const group = buildGroupFromExports(groupExport.metadata, 'css', groupExport.css, 'dialogs')
  return { metadata: groupExport.metadata, animations: groupExport.css, group }
})

// Modal Content
registerLazyGroup('modal-content-framer', async () => {
  const { groupExport } = await import('./modal-content')
  const group = buildGroupFromExports(groupExport.metadata, 'framer', groupExport.framer, 'dialogs')
  return { metadata: groupExport.metadata, animations: groupExport.framer, group }
})

registerLazyGroup('modal-content-css', async () => {
  const { groupExport } = await import('./modal-content')
  const group = buildGroupFromExports(groupExport.metadata, 'css', groupExport.css, 'dialogs')
  return { metadata: groupExport.metadata, animations: groupExport.css, group }
})

// Modal Dismiss
registerLazyGroup('modal-dismiss-framer', async () => {
  const { groupExport } = await import('./modal-dismiss')
  const group = buildGroupFromExports(groupExport.metadata, 'framer', groupExport.framer, 'dialogs')
  return { metadata: groupExport.metadata, animations: groupExport.framer, group }
})

registerLazyGroup('modal-dismiss-css', async () => {
  const { groupExport } = await import('./modal-dismiss')
  const group = buildGroupFromExports(groupExport.metadata, 'css', groupExport.css, 'dialogs')
  return { metadata: groupExport.metadata, animations: groupExport.css, group }
})

// Modal Open
registerLazyGroup('modal-open-framer', async () => {
  const { groupExport } = await import('./modal-open')
  const group = buildGroupFromExports(groupExport.metadata, 'framer', groupExport.framer, 'dialogs')
  return { metadata: groupExport.metadata, animations: groupExport.framer, group }
})

registerLazyGroup('modal-open-css', async () => {
  const { groupExport } = await import('./modal-open')
  const group = buildGroupFromExports(groupExport.metadata, 'css', groupExport.css, 'dialogs')
  return { metadata: groupExport.metadata, animations: groupExport.css, group }
})

// Modal Orchestration
registerLazyGroup('modal-orchestration-framer', async () => {
  const { groupExport } = await import('./modal-orchestration')
  const group = buildGroupFromExports(groupExport.metadata, 'framer', groupExport.framer, 'dialogs')
  return { metadata: groupExport.metadata, animations: groupExport.framer, group }
})

registerLazyGroup('modal-orchestration-css', async () => {
  const { groupExport } = await import('./modal-orchestration')
  const group = buildGroupFromExports(groupExport.metadata, 'css', groupExport.css, 'dialogs')
  return { metadata: groupExport.metadata, animations: groupExport.css, group }
})

// ============================================================================
// Navigation Registration
// ============================================================================

registerLazyCategory('dialogs', 'Dialog & Modal Animations', [
  {
    id: 'modal-base-framer',
    title: 'Base modal animations (Framer)',
    tech: 'framer',
    baseGroupId: 'modal-base',
    animationIds: [],
    metadata: modalBaseMeta,
  },
  {
    id: 'modal-base-css',
    title: 'Base modal animations (CSS)',
    tech: 'css',
    baseGroupId: 'modal-base',
    animationIds: [],
    metadata: modalBaseMeta,
  },
  {
    id: 'modal-content-framer',
    title: 'Modal content animations (Framer)',
    tech: 'framer',
    baseGroupId: 'modal-content',
    animationIds: [],
    metadata: modalContentMeta,
  },
  {
    id: 'modal-content-css',
    title: 'Modal content animations (CSS)',
    tech: 'css',
    baseGroupId: 'modal-content',
    animationIds: [],
    metadata: modalContentMeta,
  },
  {
    id: 'modal-dismiss-framer',
    title: 'Modal dismiss animations (Framer)',
    tech: 'framer',
    baseGroupId: 'modal-dismiss',
    animationIds: [],
    metadata: modalDismissMeta,
  },
  {
    id: 'modal-dismiss-css',
    title: 'Modal dismiss animations (CSS)',
    tech: 'css',
    baseGroupId: 'modal-dismiss',
    animationIds: [],
    metadata: modalDismissMeta,
  },
  {
    id: 'modal-open-framer',
    title: 'Modal open animations (Framer)',
    tech: 'framer',
    baseGroupId: 'modal-open',
    animationIds: [],
    metadata: modalOpenMeta,
  },
  {
    id: 'modal-open-css',
    title: 'Modal open animations (CSS)',
    tech: 'css',
    baseGroupId: 'modal-open',
    animationIds: [],
    metadata: modalOpenMeta,
  },
  {
    id: 'modal-orchestration-framer',
    title: 'Modal orchestration animations (Framer)',
    tech: 'framer',
    baseGroupId: 'modal-orchestration',
    animationIds: [],
    metadata: modalOrchestrationMeta,
  },
  {
    id: 'modal-orchestration-css',
    title: 'Modal orchestration animations (CSS)',
    tech: 'css',
    baseGroupId: 'modal-orchestration',
    animationIds: [],
    metadata: modalOrchestrationMeta,
  },
])

// ============================================================================
// Legacy Compatibility Export
// ============================================================================

import type { CategoryExport, CategoryMetadata } from '@/types/animation'

export const categoryMetadata: CategoryMetadata = {
  id: 'dialogs',
  title: 'Dialog & Modal Animations',
}

export const categoryExport: CategoryExport = {
  metadata: categoryMetadata,
  groups: {},
}
