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
  demoMode?: 'burst' | 'magnet' | 'trail' | 'fountain' | 'icon-dot' | 'status-row'
  previewMaxWidth?: number
  /** Configurable props surfaced in the right-side inspector panel. */
  props?: PropConfig[]
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
// Prop Configuration Types (for interactive settings panel)
// ============================================================================

/** Base fields shared by all prop config variants. */
interface PropConfigBase {
  /** Prop name on the component (must match the actual prop name). */
  name: string
  /** Human-readable label shown in the settings form. */
  label: string
  /** Optional tooltip description. */
  description?: string
  /** When true, the prop is shown in the form but cannot be edited interactively. */
  disabled?: boolean
  /** Explanation shown when disabled (e.g. "Requires element ref"). */
  disabledReason?: string
  /** Groups adjacent props with the same key into one bordered panel. Description is taken from the last prop in the group. */
  group?: string
}

/** Numeric prop — rendered as slider (when min/max provided) or number input. */
export interface NumberPropConfig extends PropConfigBase {
  type: 'number'
  default?: number
  min?: number
  max?: number
  step?: number
  /** Display unit label (e.g. 'ms', 'px', 'deg'). Does not affect the value. */
  unit?: string
}

/** Free-text string prop — rendered as text input. */
export interface StringPropConfig extends PropConfigBase {
  type: 'string'
  default?: string
}

/** Boolean prop — rendered as toggle switch. */
export interface BooleanPropConfig extends PropConfigBase {
  type: 'boolean'
  default?: boolean
}

/** Color prop — rendered as color picker + hex input. */
export interface ColorPropConfig extends PropConfigBase {
  type: 'color'
  default?: string
}

/** Enumerated prop — rendered as select dropdown. */
export interface SelectPropConfig extends PropConfigBase {
  type: 'select'
  default?: string
  options: { label: string; value: string }[]
}

/** Single image URL prop — rendered as text input with image preview. */
export interface ImagePropConfig extends PropConfigBase {
  type: 'image'
  default?: string
}

/** Array of image URLs — rendered as list of URL inputs with add/remove. */
export interface ImagesPropConfig extends PropConfigBase {
  type: 'images'
  default?: string[]
  maxItems?: number
}

/** Array of CSS color strings — rendered as list of color pickers with add/remove. */
export interface ColorsPropConfig extends PropConfigBase {
  type: 'colors'
  default?: string[]
  maxItems?: number
}

/** A single editable CSS custom-property entry within a structured style prop. */
interface StyleObjectFieldBase {
  /** CSS custom property key, e.g. `--timeline-step-bg`. */
  key: string
  /** Human-readable label shown in the nested inspector UI. */
  label: string
  /** Optional helper text shown beneath the nested field. */
  description?: string
}

/** Number-backed CSS custom property, stored with its unit when serialized. */
export interface StyleObjectNumberFieldConfig extends StyleObjectFieldBase {
  type: 'number'
  default?: number
  min?: number
  max?: number
  step?: number
  unit?: string
}

/** String-backed CSS custom property. */
export interface StyleObjectStringFieldConfig extends StyleObjectFieldBase {
  type: 'string'
  default?: string
}

/** Color-backed CSS custom property. */
export interface StyleObjectColorFieldConfig extends StyleObjectFieldBase {
  type: 'color'
  default?: string
}

/** Nested controls for the component's existing `style` prop. */
export type StyleObjectFieldConfig =
  | StyleObjectNumberFieldConfig
  | StyleObjectStringFieldConfig
  | StyleObjectColorFieldConfig

/** Structured editor for an existing `style` prop made of CSS custom properties. */
export interface StyleObjectPropConfig extends PropConfigBase {
  type: 'style-object'
  fields: StyleObjectFieldConfig[]
}

/** Discriminated union of all prop configuration types. */
export type PropConfig =
  | NumberPropConfig
  | StringPropConfig
  | BooleanPropConfig
  | ColorPropConfig
  | SelectPropConfig
  | ImagePropConfig
  | ImagesPropConfig
  | ColorsPropConfig
  | StyleObjectPropConfig

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
   * - `icon-dot`: renders a demo icon and passes it as children (for dot indicators)
   * - `status-row`: renders a status row (dot + text) around the component (for badges/pings)
   */
  demoMode?: 'burst' | 'magnet' | 'trail' | 'fountain' | 'icon-dot' | 'status-row'

  /** Max width (px) for demo canvas and preview containers. Prevents wide animations from stretching full viewport. */
  previewMaxWidth?: number

  /** Sort priority within the group. Lower values appear first. Defaults to 0. */
  order?: number

  /**
 * Configurable props exposed in the right-side inspector panel.
 * When present, the selected animation can be edited from the shared inspector UI.
   * Each entry describes one component prop — its type, default, and constraints.
   * Props with `disabled: true` are shown but not editable (refs, callbacks, ReactNode).
   */
  props?: PropConfig[]
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
