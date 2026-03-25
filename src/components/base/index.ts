import {
  buildGroupFromExports,
  registerLazyCategory,
  registerLazyGroup,
} from '@/lib/lazyGroupRegistry'
import type { GroupMetadata } from '@/types/animation'

// ============================================================================
// Group Metadata (lightweight, eager-loaded for navigation)
// ============================================================================

const textEffectsMeta: GroupMetadata = {
  id: 'text-effects',
  title: 'Text effects',
  demo: 'textEffects',
}

const standardEffectsMeta: GroupMetadata = {
  id: 'standard-effects',
  title: 'Standard effects',
  demo: 'standardEffects',
}

const buttonEffectsMeta: GroupMetadata = {
  id: 'button-effects',
  title: 'Button effects',
  demo: 'buttonEffects',
}

// ============================================================================
// Lazy Loaders (heavy code split into separate chunks)
// ============================================================================

// Text Effects
registerLazyGroup('text-effects-framer', async () => {
  const { groupExport } = await import('./text-effects')
  const group = buildGroupFromExports(groupExport.metadata, 'framer', groupExport.framer, 'base')
  return { metadata: groupExport.metadata, animations: groupExport.framer, group }
})

registerLazyGroup('text-effects-css', async () => {
  const { groupExport } = await import('./text-effects')
  const group = buildGroupFromExports(groupExport.metadata, 'css', groupExport.css, 'base')
  return { metadata: groupExport.metadata, animations: groupExport.css, group }
})

// Standard Effects
registerLazyGroup('standard-effects-framer', async () => {
  const { groupExport } = await import('./standard-effects')
  const group = buildGroupFromExports(groupExport.metadata, 'framer', groupExport.framer, 'base')
  return { metadata: groupExport.metadata, animations: groupExport.framer, group }
})

registerLazyGroup('standard-effects-css', async () => {
  const { groupExport } = await import('./standard-effects')
  const group = buildGroupFromExports(groupExport.metadata, 'css', groupExport.css, 'base')
  return { metadata: groupExport.metadata, animations: groupExport.css, group }
})

// Button Effects
registerLazyGroup('button-effects-framer', async () => {
  const { groupExport } = await import('./button-effects')
  const group = buildGroupFromExports(groupExport.metadata, 'framer', groupExport.framer, 'base')
  return { metadata: groupExport.metadata, animations: groupExport.framer, group }
})

registerLazyGroup('button-effects-css', async () => {
  const { groupExport } = await import('./button-effects')
  const group = buildGroupFromExports(groupExport.metadata, 'css', groupExport.css, 'base')
  return { metadata: groupExport.metadata, animations: groupExport.css, group }
})

// ============================================================================
// Navigation Registration
// ============================================================================

registerLazyCategory('base', 'Base Effects', [
  { id: 'text-effects-framer', title: 'Text Effects (Framer)', tech: 'framer', baseGroupId: 'text-effects', animationIds: [], metadata: textEffectsMeta },
  { id: 'text-effects-css', title: 'Text Effects (CSS)', tech: 'css', baseGroupId: 'text-effects', animationIds: [], metadata: textEffectsMeta },
  { id: 'standard-effects-framer', title: 'Standard Effects (Framer)', tech: 'framer', baseGroupId: 'standard-effects', animationIds: [], metadata: standardEffectsMeta },
  { id: 'standard-effects-css', title: 'Standard Effects (CSS)', tech: 'css', baseGroupId: 'standard-effects', animationIds: [], metadata: standardEffectsMeta },
  { id: 'button-effects-framer', title: 'Button Effects (Framer)', tech: 'framer', baseGroupId: 'button-effects', animationIds: [], metadata: buttonEffectsMeta },
  { id: 'button-effects-css', title: 'Button Effects (CSS)', tech: 'css', baseGroupId: 'button-effects', animationIds: [], metadata: buttonEffectsMeta },
])

// ============================================================================
// Legacy Compatibility Export
// ============================================================================

import type { CategoryExport, CategoryMetadata } from '@/types/animation'

export const categoryMetadata: CategoryMetadata = {
  id: 'base',
  title: 'Base Effects',
}

export const categoryExport: CategoryExport = {
  metadata: categoryMetadata,
  groups: {},
}
