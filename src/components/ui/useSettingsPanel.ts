import type { PropConfig } from '@/types/animation'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/** Module-level ref: the close function of the currently open settings panel. */
let activeCloseRef: (() => void) | null = null

/** Extracts default values from a props config array into a record. */
function buildDefaults(propsConfig: PropConfig[]): Record<string, unknown> {
  const defaults: Record<string, unknown> = {}
  for (const prop of propsConfig) {
    if (prop.disabled) continue
    if (prop.default !== undefined) {
      defaults[prop.name] = prop.default
    }
  }
  return defaults
}

/** State shape returned by useSettingsPanel. */
export interface SettingsPanelState {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
  /** Current prop override values (only non-disabled props with set values). */
  propOverrides: Record<string, unknown>
  /** Update a single prop value. */
  setProp: (name: string, value: unknown) => void
  /** Reset all props to their default values. */
  resetDefaults: () => void
  /** Whether any prop differs from its default value. */
  isDirty: boolean
}

/**
 * Manages the settings panel state: open/close, prop override values, reset.
 * Returns stable references suitable for passing to memoized children.
 */
export function useSettingsPanel(propsConfig: PropConfig[] | undefined): SettingsPanelState {
  const [isOpen, setIsOpen] = useState(false)

  const defaults = useMemo(() => buildDefaults(propsConfig ?? []), [propsConfig])
  const [overrides, setOverrides] = useState<Record<string, unknown>>(() => ({ ...defaults }))

  const closeRef = useRef<(() => void) | undefined>(undefined)

  const close = useCallback(() => {
    setIsOpen(false)
    if (activeCloseRef === closeRef.current) activeCloseRef = null
  }, [])

  // Stable ref so the module-level singleton can call it
  closeRef.current = close

  const open = useCallback(() => {
    if (activeCloseRef && activeCloseRef !== closeRef.current) activeCloseRef()
    activeCloseRef = closeRef.current!
    setIsOpen(true)
  }, [])

  const toggle = useCallback(() => {
    setIsOpen((v) => {
      if (v) {
        if (activeCloseRef === closeRef.current) activeCloseRef = null
        return false
      }
      if (activeCloseRef && activeCloseRef !== closeRef.current) activeCloseRef()
      activeCloseRef = closeRef.current!
      return true
    })
  }, [])

  // Clean up if this hook unmounts while open
  useEffect(() => {
    return () => {
      if (activeCloseRef === closeRef.current) activeCloseRef = null
    }
  }, [])

  const setProp = useCallback((name: string, value: unknown) => {
    setOverrides((prev) => ({ ...prev, [name]: value }))
  }, [])

  const resetDefaults = useCallback(() => {
    setOverrides({ ...defaults })
  }, [defaults])

  const isDirty = useMemo(() => {
    for (const key of Object.keys(overrides)) {
      const current = overrides[key]
      const def = defaults[key]
      if (Array.isArray(current) && Array.isArray(def)) {
        if (current.length !== def.length || current.some((v, i) => v !== def[i])) return true
      } else if (current !== def) {
        return true
      }
    }
    return false
  }, [overrides, defaults])

  return {
    isOpen,
    open,
    close,
    toggle,
    propOverrides: overrides,
    setProp,
    resetDefaults,
    isDirty,
  }
}
