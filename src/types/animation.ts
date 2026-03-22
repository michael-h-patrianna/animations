import type { ComponentType } from 'react'

// ============================================================================
// Shared Enums / Unions
// ============================================================================

/** Type of interactive controls shown in the AnimationCard footer. */
export type AnimationControlType = 'lights' | 'prizeCount'

/** Position of an animation within its preview viewport. */
export type PreviewPosition =
  | 'center'
  | 'top-left'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-center'
  | 'bottom-center'

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
  /** Pre-computed URL path for the Framer variant, e.g. "/text-effects-framer?animation=text-effects__character-reveal" */
  urlSlugFramer: string
  /** Pre-computed URL path for the CSS variant, e.g. "/text-effects-css?animation=text-effects__character-reveal" */
  urlSlugCss: string
  disableReplay?: boolean
  infinite?: boolean
  controls?: AnimationControlType
  prizeCountMax?: number
  previewPosition?: PreviewPosition
  tier?: 1 | 2 | 3 | 4
  demoMode?: 'burst' | 'magnet' | 'trail' | 'fountain'
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
 *   tier: 1,
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

  /** When true, the AnimationCard should disable the replay button */
  disableReplay?: boolean

  /** When true, animation loops continuously without needing replay */
  infinite?: boolean

  /** Type of interactive controls to show in the animation card footer */
  controls?: AnimationControlType

  /** Maximum prize count for prizeCount controls (default: 4) */
  prizeCountMax?: number

  /** Position of the animation within the preview viewport (default: 'center') */
  previewPosition?: PreviewPosition

  /**
   * Full URL path to view this animation's Framer variant.
   * Optional in metadata — the catalog computes these from the group ID and animation ID.
   * When present, serves as documentation of the intended URL.
   */
  urlSlugFramer?: string

  /**
   * Full URL path to view this animation's CSS variant.
   * Optional in metadata — the catalog computes these from the group ID and animation ID.
   * When present, serves as documentation of the intended URL.
   */
  urlSlugCss?: string

  /**
   * Portability tier — classifies what a user needs to copy-paste this animation.
   *
   * - **1 (Effect)**: Copy just the CSS keyframes or Motion animate props. Apply to any element.
   *   No project imports (`@/`), no CSS file imports (framer) or no shared.css (CSS).
   * - **2 (Decorated Effect)**: Copy the component file + its CSS. May import `@/motion/*` or
   *   `@/utils/*` (small extractable utilities). May import own CSS + shared.css.
   * - **3 (Orchestration)**: Copy the component + CSS + follow the HTML structure. Multiple
   *   coordinated elements with variants/stagger. No `@/assets` imports.
   * - **4 (Full Component)**: Copy the entire group directory. Unrestricted imports including
   *   `@/assets`. Complex state machines, sub-components, images.
   */
  tier?: 1 | 2 | 3 | 4

  /**
   * When set, the catalog renders demo anchor UI alongside the animation.
   * The animation component itself stays standalone — demo rendering is handled
   * by the catalog layer (GroupSection), not the component.
   *
   * - `burst`: single Source anchor at random position
   * - `magnet`: Source + Target anchors with minimum distance
   * - `trail`: Source + Target anchors with minimum distance
   * - `fountain`: single Source anchor in bottom region
   */
  demoMode?: 'burst' | 'magnet' | 'trail' | 'fountain'
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

  /** Raw source code of the component (.tsx), loaded via ?raw import */
  source?: string

  /** Raw source code of the co-located CSS file, loaded via ?raw import */
  cssSource?: string
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

// ============================================================================
// Code Viewer Types
// ============================================================================

/** A single source-code tab displayed in the code viewer modal. */
export interface SourceTab {
  /** Tab label shown in the tab bar (e.g. "Component (Motion)", "CSS") */
  label: string

  /** Raw source code to display */
  code: string

  /** Language for syntax highlighting */
  language: 'tsx' | 'css'
}
