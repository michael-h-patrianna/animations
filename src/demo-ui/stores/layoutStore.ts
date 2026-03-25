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

/** Manages panel visibility, theme mode, and accent color selection. */
export interface LayoutStore {
  showLeftPanel: boolean
  showRightPanel: boolean
  theme: ThemeMode
  accent: AccentColor

  toggleLeftPanel: () => void
  setLeftPanel: (show: boolean) => void
  toggleRightPanel: () => void
  setRightPanel: (show: boolean) => void
  setTheme: (theme: ThemeMode) => void
  setAccent: (accent: AccentColor) => void
}

/** Collapse side panel by default on mobile viewports */
const isMobileViewport = typeof window !== 'undefined' && window.innerWidth < 1220

/** Default theme used for initial state and persisted-state migration. */
export const DEFAULT_THEME: ThemeMode = 'dark-blue'

/** Default accent used for initial state and persisted-state migration. */
export const DEFAULT_ACCENT: AccentColor = 'blue'

/** Set of valid theme mode values for migration validation. */
const VALID_THEMES = new Set<string>(THEME_MODES)

/** Set of valid accent color values for migration validation. */
const VALID_ACCENTS = new Set<string>(ACCENT_COLORS)

export const useLayoutStore = create<LayoutStore>()(
  persist(
    (set) => ({
      showLeftPanel: !isMobileViewport,
      showRightPanel: false,
      theme: DEFAULT_THEME,
      accent: DEFAULT_ACCENT,

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
        return merged
      },
    }
  )
)
