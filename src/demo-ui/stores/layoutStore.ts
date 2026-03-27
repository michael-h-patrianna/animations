/**
 * Layout Store for Animation Catalog Demo UI
 * Manages panel visibility and theme state.
 */

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

/**
 * Available theme modes — mapped to `data-mode` attribute on [data-demo-ui].
 * Values are data-attribute identifiers, not CSS color values.
 */
export const THEME_MODES = ['dark-purple', 'dark-blue', 'dark-brown', 'dark-black'] as const
/** Union of available theme mode strings. */
export type ThemeMode = (typeof THEME_MODES)[number]

/** Human-readable display labels for theme modes. */
export const THEME_LABELS: Record<ThemeMode, string> = {
  'dark-purple': 'Dark Purple',
  'dark-blue': 'Dark Blue',
  'dark-brown': 'Dark Brown',
  'dark-black': 'Dark Black',
}

/**
 * Available accent colors — mapped to `data-accent` attribute on [data-demo-ui].
 * Each value selects a token override set in tokens.css (e.g. `[data-accent='cyan']`).
 * Values are data-attribute identifiers, not CSS color values.
 */
export const ACCENT_COLORS = [
  'cyan',
  'green',
  'magenta',
  'orange',
  'blue',
  'violet',
  'red',
] as const
/** Union of available accent color identifiers. */
export type AccentColor = (typeof ACCENT_COLORS)[number]

/**
 * Available preview fonts for demonstrating animations in different typographic contexts.
 * All fonts are self-hosted as woff2 in public/fonts/.
 */
export const PREVIEW_FONTS = [
  'Lato',
  'Inter',
  'Roboto',
  'Poppins',
  'Ubuntu',
  'Noto Sans',
  'DM Sans',
  'Outfit',
  'Space Grotesk',
  'Plus Jakarta Sans',
  'Baloo 2',
  'IBM Plex Sans',
  'Comic Sans MS',
] as const
/** Union of available preview font names. */
export type PreviewFont = (typeof PREVIEW_FONTS)[number]

/**
 * Reduced motion preference override for catalog preview.
 * - `'system'`: respect OS `prefers-reduced-motion` setting
 * - `'reduce'`: force reduced motion (preview what reduced-motion users see)
 * - `'no-preference'`: force full animations (override OS setting)
 */
export const REDUCED_MOTION_OPTIONS = ['system', 'reduce', 'no-preference'] as const
/** Union of reduced motion preference values. */
export type ReducedMotionPreference = (typeof REDUCED_MOTION_OPTIONS)[number]

/** Human-readable display labels for motion preferences. */
export const REDUCED_MOTION_LABELS: Record<ReducedMotionPreference, string> = {
  system: 'System',
  reduce: 'Reduced',
  'no-preference': 'Full',
}

/** Manages panel visibility, theme mode, accent color, font, motion preference, and profiler. */
export interface LayoutStore {
  showLeftPanel: boolean
  showRightPanel: boolean
  theme: ThemeMode
  accent: AccentColor
  previewFont: PreviewFont
  reducedMotion: ReducedMotionPreference
  showProfiler: boolean

  toggleLeftPanel: () => void
  setLeftPanel: (show: boolean) => void
  toggleRightPanel: () => void
  setRightPanel: (show: boolean) => void
  setTheme: (theme: ThemeMode) => void
  setAccent: (accent: AccentColor) => void
  setPreviewFont: (font: PreviewFont) => void
  setReducedMotion: (pref: ReducedMotionPreference) => void
  toggleProfiler: () => void
}

/** Collapse side panel by default on mobile viewports */
const isMobileViewport = typeof window !== 'undefined' && window.innerWidth < 1220

/** Default theme used for initial state and persisted-state migration. */
export const DEFAULT_THEME: ThemeMode = 'dark-blue'

/** Default accent used for initial state and persisted-state migration. */
export const DEFAULT_ACCENT: AccentColor = 'blue'

/** Default preview font used for initial state and persisted-state migration. */
export const DEFAULT_PREVIEW_FONT: PreviewFont = 'Lato'

/** Set of valid theme mode values for migration validation. */
const VALID_THEMES = new Set<string>(THEME_MODES)

/** Set of valid accent color values for migration validation. */
const VALID_ACCENTS = new Set<string>(ACCENT_COLORS)

/** Set of valid preview font values for migration validation. */
const VALID_PREVIEW_FONTS = new Set<string>(PREVIEW_FONTS)

/** Set of valid reduced motion preference values for migration validation. */
const VALID_REDUCED_MOTION = new Set<string>(REDUCED_MOTION_OPTIONS)

export const useLayoutStore = create<LayoutStore>()(
  persist(
    (set) => ({
      showLeftPanel: !isMobileViewport,
      showRightPanel: false,
      theme: DEFAULT_THEME,
      accent: DEFAULT_ACCENT,
      previewFont: DEFAULT_PREVIEW_FONT,
      reducedMotion: 'system' as ReducedMotionPreference,
      showProfiler: false,

      toggleLeftPanel: () => {
        set((state) => ({ showLeftPanel: !state.showLeftPanel }))
      },
      setLeftPanel: (show) => {
        set({ showLeftPanel: show })
      },
      toggleRightPanel: () => {
        set((state) => ({ showRightPanel: !state.showRightPanel }))
      },
      setRightPanel: (show) => {
        set({ showRightPanel: show })
      },
      setTheme: (theme) => {
        set({ theme })
      },
      setAccent: (accent) => {
        set({ accent })
      },
      setPreviewFont: (previewFont) => {
        set({ previewFont })
      },
      setReducedMotion: (reducedMotion) => {
        set({ reducedMotion })
      },
      toggleProfiler: () => {
        set((state) => ({ showProfiler: !state.showProfiler }))
      },
    }),
    {
      name: 'animation-catalog-layout',
      merge: (persistedState, currentState) => {
        const merged = {
          ...currentState,
          ...(persistedState as Partial<LayoutStore>),
        }
        if (isMobileViewport) {
          merged.showLeftPanel = false
        }
        // Migrate legacy theme values like "dark" or "light" to the current default.
        if (!VALID_THEMES.has(merged.theme)) {
          merged.theme = DEFAULT_THEME
        }
        // Migrate invalid accent values to default
        if (!VALID_ACCENTS.has(merged.accent)) {
          merged.accent = DEFAULT_ACCENT
        }
        // Migrate missing or invalid preview font to default
        if (!VALID_PREVIEW_FONTS.has(merged.previewFont)) {
          merged.previewFont = DEFAULT_PREVIEW_FONT
        }
        // Migrate invalid reduced motion values to default
        if (!VALID_REDUCED_MOTION.has(merged.reducedMotion)) {
          merged.reducedMotion = 'system' as ReducedMotionPreference
        }
        return merged
      },
    }
  )
)

/** Sync preview font to :root CSS variable so all elements (including portals) inherit it. */
function syncFontToRoot(font: PreviewFont) {
  document.documentElement.style.setProperty('--pf-preview-font', font)
}
syncFontToRoot(useLayoutStore.getState().previewFont)
useLayoutStore.subscribe(
  (state, prev) => {
    if (state.previewFont !== prev.previewFont) syncFontToRoot(state.previewFont)
  }
)
