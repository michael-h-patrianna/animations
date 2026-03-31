import type { AnimationExport, Group, GroupMetadata } from './animation'

// ============================================================================
// Lazy Loading Types
// ============================================================================

/**
 * Represents a lazy-loadable group variant (framer or css).
 * Contains only metadata needed for navigation, not the actual animation code.
 */
export interface LazyGroup {
  /** Full group ID with tech suffix (e.g., 'modal-base-framer') */
  id: string

  /** Human-readable display title */
  title: string

  /** Technology variant */
  tech: 'framer' | 'css'

  /** Base group ID without tech suffix (e.g., 'modal-base') */
  baseGroupId: string

  /** Parent category ID */
  categoryId: string

  /** Group metadata */
  metadata: GroupMetadata
}

/**
 * Represents a category containing lazy-loadable groups.
 * Contains only navigation metadata, not actual animation code.
 */
export interface LazyCategory {
  /** Category ID */
  id: string

  /** Human-readable display title */
  title: string

  /** Groups in this category */
  groups: LazyGroup[]
}

/**
 * Result of loading a lazy group.
 */
export interface LazyGroupResult {
  /** Group metadata */
  metadata: GroupMetadata

  /** Animation exports for this group */
  animations: Record<string, AnimationExport>

  /** Built Group object ready for rendering */
  group: Group
}

/**
 * Loader function that dynamically imports a group's code.
 */
export type LazyGroupLoader = () => Promise<LazyGroupResult>

/**
 * Cache entry for a loaded group.
 */
export interface GroupCacheEntry {
  /** Promise of the loading operation (for deduplication) */
  promise: Promise<LazyGroupResult>

  /** Resolved result (undefined until loaded) */
  result?: LazyGroupResult

  /** Error if loading failed */
  error?: Error

  /** Timestamp when loading started */
  loadedAt?: number
}

/**
 * Navigation catalog - lightweight structure for sidebar/nav rendering.
 * Contains no actual animation code, just IDs and titles.
 */
export interface LazyNavCatalog {
  /** Categories with their groups */
  categories: LazyCategory[]

  /** Flat map of all group IDs to their lazy metadata */
  groupMap: Record<string, LazyGroup>
}

/**
 * Hook result for useLazyAnimations.
 */
export interface LazyAnimationsResult {
  /** Navigation catalog (always available) */
  navCatalog: LazyNavCatalog

  /** Currently loaded group (undefined if not loaded yet) */
  currentGroup?: Group

  /** True while a group transition is in progress (React 19 useTransition). Previous group stays visible. */
  isPending: boolean

  /** Error if loading failed */
  error?: Error

  /** Load a group by ID (wraps in a React transition) */
  loadGroup: (groupId: string) => Promise<void>

  /** Check if a group is already cached */
  isGroupCached: (groupId: string) => boolean
}
