import type { ComponentType } from 'react'

// ============================================================================
// Core Types
// ============================================================================

/**
 * Represents an animation definition.
 * Contains all metadata including category and group associations.
 */
export interface Animation {
  id: string
  title: string
  description: string
  categoryId: string
  groupId: string
  tags?: string[]
  disableReplay?: boolean // when true, the AnimationCard should disable the replay button
}

/**
 * Represents a group of animations.
 * Contains group metadata and all animations belonging to this group.
 */
export interface Group {
  id: string
  title: string
  tech?: GroupMetadata['tech']
  demo?: string
  animations: Animation[]
}

/**
 * Represents a category of animation groups.
 * Contains category metadata and all groups belonging to this category.
 */
export interface Category {
  id: string
  title: string
  groups: Group[]
}

// ============================================================================
// Component Metadata Types
// ============================================================================

/**
 * Metadata exported by individual animation components.
 * Does not include categoryId/groupId as these are implicit from the folder structure.
 *
 * @example
 * ```typescript
 * export const metadata: AnimationMetadata = {
 *   id: 'modal-base__scale-gentle-pop',
 *   title: 'Gentle Pop',
 *   description: 'A smooth scaling animation with gentle easing',
 *   tags: ['scale', 'modal', 'gentle'],
 *   disableReplay: false
 * };
 * ```
 */
export interface AnimationMetadata {
  /** Unique identifier for the animation (e.g., 'modal-base__scale-gentle-pop') */
  id: string

  /** Human-readable display name */
  title: string

  /** Detailed description of the animation behavior */
  description: string

  /** Array of tags for categorization and search (can be empty) */
  tags: string[]

  /** When true, the AnimationCard should disable the replay button */
  disableReplay?: boolean
}

/**
 * Metadata exported by group index files.
 * Represents a collection of related animations.
 *
 * @example
 * ```typescript
 * export const metadata: GroupMetadata = {
 *   id: 'modal-base',
 *   title: 'Modal Animations',
 *   tech: 'framer',
 *   demo: 'A collection of modal entrance/exit animations',
 *   icon: 'window'
 * };
 * ```
 */
export interface GroupMetadata {
  /** Unique identifier for the group (e.g., 'modal-base') */
  id: string

  /** Human-readable display name */
  title: string

  /** Primary technology used for animations in this group */
  tech?: 'css' | 'framer' | 'js'

  /** Demo description or usage notes */
  demo?: string

  /** Optional icon identifier for UI display */
  icon?: string
}

/**
 * Metadata exported by category index files.
 * Represents a top-level category of animation groups.
 *
 * @example
 * ```typescript
 * export const metadata: CategoryMetadata = {
 *   id: 'dialogs',
 *   title: 'Dialog & Modal Animations',
 *   icon: 'window-maximize'
 * };
 * ```
 */
export interface CategoryMetadata {
  /** Unique identifier for the category (e.g., 'dialogs') */
  id: string

  /** Human-readable display name */
  title: string

  /** Optional icon identifier for UI display */
  icon?: string
}

// ============================================================================
// Aggregated Export Types (for co-located metadata system)
// ============================================================================

/**
 * Represents a complete animation export from a component file.
 * Combines the React component with its metadata.
 *
 * @example
 * ```typescript
 * // In ModalBaseScaleGentlePop.tsx
 * export const animationExport: AnimationExport = {
 *   component: ModalBaseScaleGentlePop,
 *   metadata: { id: 'modal-base__scale-gentle-pop', ... }
 * };
 * ```
 */
export interface AnimationExport {
  /** The React component that renders the animation */
  component: ComponentType<Record<string, unknown>>

  /** Metadata describing the animation */
  metadata: AnimationMetadata
}

/**
 * Represents a complete group export from a group index file.
 * Combines group metadata with all animations in the group.
 * Separates framer and css animations to support code mode switching.
 *
 * @example
 * ```typescript
 * // In src/components/dialogs/modal-base/index.ts
 * export const groupExport: GroupExport = {
 *   metadata: { id: 'modal-base', title: 'Modal Animations', ... },
 *   framer: {
 *     'modal-base__scale-gentle-pop': { component: ..., metadata: ... },
 *     'modal-base__slide-up-soft': { component: ..., metadata: ... }
 *   },
 *   css: {}
 * };
 * ```
 */
export interface GroupExport {
  /** Metadata describing the group */
  metadata: GroupMetadata

  /** Map of animation IDs to their complete exports (Framer Motion) */
  framer: Record<string, AnimationExport>

  /** Map of animation IDs to their complete exports (CSS) */
  css: Record<string, AnimationExport>
}

/**
 * Represents a complete category export from a category index file.
 * Combines category metadata with all groups in the category.
 *
 * @example
 * ```typescript
 * // In src/components/dialogs/index.ts
 * export const categoryExport: CategoryExport = {
 *   metadata: { id: 'dialogs', title: 'Dialog & Modal Animations', ... },
 *   groups: {
 *     'modal-base': { metadata: ..., animations: ... },
 *     'drawer': { metadata: ..., animations: ... }
 *   }
 * };
 * ```
 */
export interface CategoryExport {
  /** Metadata describing the category */
  metadata: CategoryMetadata

  /** Map of group IDs to their complete exports */
  groups: Record<string, GroupExport>
}
