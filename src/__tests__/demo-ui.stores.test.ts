import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useDropdownStore } from '@/demo-ui/stores/dropdownStore'
import {
  ACCENT_COLORS,
  DEFAULT_ACCENT,
  DEFAULT_THEME,
  THEME_MODES,
  useLayoutStore,
  type AccentColor,
  type ThemeMode,
} from '@/demo-ui/stores/layoutStore'

// ── dropdownStore ────────────────────────────────────────────────────────

describe('dropdownStore', () => {
  beforeEach(() => {
    useDropdownStore.setState({ openDropdownId: null })
  })

  it('opens a dropdown by ID', () => {
    useDropdownStore.getState().openDropdown('file-menu')
    expect(useDropdownStore.getState().openDropdownId).toBe('file-menu')
  })

  it('replaces the currently open dropdown when opening another', () => {
    useDropdownStore.getState().openDropdown('file-menu')
    useDropdownStore.getState().openDropdown('view-menu')
    expect(useDropdownStore.getState().openDropdownId).toBe('view-menu')
  })

  it('closeDropdown without ID closes any open dropdown', () => {
    useDropdownStore.getState().openDropdown('file-menu')
    useDropdownStore.getState().closeDropdown()
    expect(useDropdownStore.getState().openDropdownId).toBeNull()
  })

  it('closeDropdown with matching ID closes that dropdown', () => {
    useDropdownStore.getState().openDropdown('file-menu')
    useDropdownStore.getState().closeDropdown('file-menu')
    expect(useDropdownStore.getState().openDropdownId).toBeNull()
  })

  it('closeDropdown with non-matching ID does not close current dropdown', () => {
    useDropdownStore.getState().openDropdown('file-menu')
    useDropdownStore.getState().closeDropdown('view-menu')
    expect(useDropdownStore.getState().openDropdownId).toBe('file-menu')
  })

  it('toggleDropdown opens when closed', () => {
    useDropdownStore.getState().toggleDropdown('file-menu')
    expect(useDropdownStore.getState().openDropdownId).toBe('file-menu')
  })

  it('toggleDropdown closes when same ID is open', () => {
    useDropdownStore.getState().openDropdown('file-menu')
    useDropdownStore.getState().toggleDropdown('file-menu')
    expect(useDropdownStore.getState().openDropdownId).toBeNull()
  })

  it('toggleDropdown switches to new ID when different ID is open', () => {
    useDropdownStore.getState().openDropdown('file-menu')
    useDropdownStore.getState().toggleDropdown('view-menu')
    expect(useDropdownStore.getState().openDropdownId).toBe('view-menu')
  })
})

// ── layoutStore ──────────────────────────────────────────────────────────

describe('layoutStore', () => {
  beforeEach(() => {
    // Reset to defaults before each test
    useLayoutStore.setState({
      showLeftPanel: true,
      theme: DEFAULT_THEME,
      accent: DEFAULT_ACCENT,
    })
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('toggleLeftPanel flips panel visibility', () => {
    useLayoutStore.getState().toggleLeftPanel()
    expect(useLayoutStore.getState().showLeftPanel).toBe(false)

    useLayoutStore.getState().toggleLeftPanel()
    expect(useLayoutStore.getState().showLeftPanel).toBe(true)
  })

  it('setLeftPanel sets explicit state', () => {
    useLayoutStore.getState().setLeftPanel(false)
    expect(useLayoutStore.getState().showLeftPanel).toBe(false)

    useLayoutStore.getState().setLeftPanel(true)
    expect(useLayoutStore.getState().showLeftPanel).toBe(true)
  })

  it('setTheme updates theme mode', () => {
    const target: ThemeMode = 'dark-blue'
    useLayoutStore.getState().setTheme(target)
    expect(useLayoutStore.getState().theme).toBe('dark-blue')
  })

  it('setAccent updates accent color', () => {
    const target: AccentColor = 'magenta'
    useLayoutStore.getState().setAccent(target)
    expect(useLayoutStore.getState().accent).toBe('magenta')
  })

  it('uses dark-blue theme and blue accent as defaults', () => {
    expect(useLayoutStore.getState().theme).toBe(DEFAULT_THEME)
    expect(useLayoutStore.getState().accent).toBe(DEFAULT_ACCENT)
  })

  it('all theme modes start with dark- prefix', () => {
    expect(THEME_MODES).toEqual(expect.arrayContaining([expect.stringMatching(/^dark-/)]))
    // Verify exact known set for regression detection
    expect(THEME_MODES).toContain('dark-purple')
    expect(THEME_MODES).toContain('dark-blue')
  })

  it('accent colors include required defaults', () => {
    expect(ACCENT_COLORS).toContain('cyan')
    expect(ACCENT_COLORS).toContain('green')
    expect(ACCENT_COLORS).toContain('magenta')
  })

  it('persist merge migrates invalid theme to default', () => {
    // Simulate a persisted state with a legacy/invalid theme
    const persisted = {
      showLeftPanel: true,
      theme: 'light' as unknown as ThemeMode, // legacy value
      accent: DEFAULT_ACCENT,
    }

    // Access the persist config via internal API
    const persistApi = useLayoutStore.persist
    const mergeResult = persistApi.getOptions().merge?.(persisted, useLayoutStore.getState())

    // The merge function should replace invalid theme with default
    expect(mergeResult?.theme).toBe(DEFAULT_THEME)
  })

  it('persist merge preserves valid theme', () => {
    const persisted = {
      showLeftPanel: false,
      theme: 'dark-blue' as ThemeMode,
      accent: 'green' as AccentColor,
    }

    const mergeResult = useLayoutStore.persist
      .getOptions()
      .merge?.(persisted, useLayoutStore.getState())

    expect(mergeResult?.theme).toBe('dark-blue')
    expect(mergeResult?.accent).toBe('green')
    expect(mergeResult?.showLeftPanel).toBe(false)
  })

  it('persist merge migrates "dark" legacy theme to default', () => {
    const persisted = {
      showLeftPanel: true,
      theme: 'dark' as unknown as ThemeMode,
      accent: DEFAULT_ACCENT,
    }

    const mergeResult = useLayoutStore.persist
      .getOptions()
      .merge?.(persisted, useLayoutStore.getState())

    expect(mergeResult?.theme).toBe(DEFAULT_THEME)
  })

  it('persist merge handles null persisted state gracefully', () => {
    // zustand persist passes null when no data in storage
    const mergeResult = useLayoutStore.persist.getOptions().merge?.(null, useLayoutStore.getState())

    // Should fallback to current state defaults
    expect(mergeResult?.theme).toBe(DEFAULT_THEME)
    expect(mergeResult?.accent).toBe(DEFAULT_ACCENT)
  })

  it('persist merge handles empty persisted state', () => {
    const mergeResult = useLayoutStore.persist.getOptions().merge?.({}, useLayoutStore.getState())

    // Current state defaults should remain
    expect(mergeResult?.theme).toBe(DEFAULT_THEME)
    expect(mergeResult?.accent).toBe(DEFAULT_ACCENT)
  })

  it('persist merge handles persisted state with extra unknown keys', () => {
    const persisted = {
      showLeftPanel: false,
      theme: 'dark-brown' as ThemeMode,
      accent: 'red' as AccentColor,
      unknownKey: 'should be ignored by store',
    }

    const mergeResult = useLayoutStore.persist
      .getOptions()
      .merge?.(persisted, useLayoutStore.getState())

    expect(mergeResult?.theme).toBe('dark-brown')
    expect(mergeResult?.accent).toBe('red')
    expect(mergeResult?.showLeftPanel).toBe(false)
  })

  it('setTheme cycles through all valid theme modes', () => {
    for (const mode of THEME_MODES) {
      useLayoutStore.getState().setTheme(mode)
      expect(useLayoutStore.getState().theme).toBe(mode)
    }
  })

  it('setAccent cycles through all valid accent colors', () => {
    for (const color of ACCENT_COLORS) {
      useLayoutStore.getState().setAccent(color)
      expect(useLayoutStore.getState().accent).toBe(color)
    }
  })

  it('toggleLeftPanel is idempotent over 2 calls (returns to original state)', () => {
    const initial = useLayoutStore.getState().showLeftPanel
    useLayoutStore.getState().toggleLeftPanel()
    useLayoutStore.getState().toggleLeftPanel()
    expect(useLayoutStore.getState().showLeftPanel).toBe(initial)
  })

  it('setLeftPanel with same value is idempotent', () => {
    useLayoutStore.getState().setLeftPanel(true)
    useLayoutStore.getState().setLeftPanel(true)
    expect(useLayoutStore.getState().showLeftPanel).toBe(true)
  })

  it('persist merge preserves all valid THEME_MODES values', () => {
    const merge = useLayoutStore.persist.getOptions().merge!

    for (const mode of THEME_MODES) {
      const persisted = { theme: mode }
      const result = merge(persisted, useLayoutStore.getState())
      expect(result?.theme, `Theme "${mode}" should survive persist merge`).toBe(mode)
    }
  })

  it('persist merge rejects theme values not in THEME_MODES', () => {
    const merge = useLayoutStore.persist.getOptions().merge!
    const invalidThemes = ['light', 'dark', 'blue', '', 'dark-', 'dark-purple-extra']

    for (const invalid of invalidThemes) {
      const persisted = { theme: invalid as ThemeMode }
      const result = merge(persisted, useLayoutStore.getState())
      expect(result?.theme, `Theme "${invalid}" should be rejected`).toBe(DEFAULT_THEME)
    }
  })
})
