import { useMemo } from 'react'
import {
  THEME_MODES,
  THEME_LABELS,
  ACCENT_COLORS,
  type ThemeMode,
  type AccentColor,
} from '@/demo-ui/stores/layoutStore'
import type { DropdownMenuItem } from '@/demo-ui/components/ui/DropdownMenu'

/** Capitalize first letter of a string for display labels. */
function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

/** Builds the VIEW dropdown menu items for theme and accent selection. */
export function useViewMenuItems(
  theme: ThemeMode,
  setTheme: (t: ThemeMode) => void,
  accent: AccentColor,
  setAccent: (a: AccentColor) => void
): DropdownMenuItem[] {
  const modeItems = useMemo(
    () =>
      THEME_MODES.map((mode) => ({
        label: (theme === mode ? '✓ ' : '  ') + THEME_LABELS[mode],
        onClick: () => setTheme(mode),
        'data-testid': `theme-${mode}`,
      })),
    [theme, setTheme]
  )

  const accentItems = useMemo(
    () =>
      ACCENT_COLORS.map((color) => ({
        label: (accent === color ? '✓ ' : '  ') + capitalize(color),
        onClick: () => setAccent(color),
        'data-testid': `accent-${color}`,
      })),
    [accent, setAccent]
  )

  return useMemo(
    () => [
      { label: 'Theme', items: modeItems },
      { label: 'Accent', items: accentItems },
    ],
    [modeItems, accentItems]
  )
}
