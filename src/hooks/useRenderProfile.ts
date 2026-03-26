/**
 * Hook that captures React Profiler render timing for a component.
 *
 * In dev mode, returns the most recent `actualDuration` and `baseDuration`
 * from `<React.Profiler>`. In production, returns `null` — no Profiler overhead.
 *
 * Use with `ProfilerWrapper` to add profiling around any component tree.
 */

import { useCallback, useRef, useState } from 'react'

/** Render timing data from React's Profiler API. */
export interface RenderProfile {
  /** Time spent rendering the committed update (ms). */
  actualDuration: number
  /** Estimated time to render the entire subtree without memoization (ms). */
  baseDuration: number
}

/**
 * Captures render profiling data from React.Profiler callbacks.
 * Returns `null` in production — callers should skip rendering Profiler.
 */
export function useRenderProfile(): {
  profile: RenderProfile | null
  onRender: (
    id: string,
    phase: 'mount' | 'update' | 'nested-update',
    actualDuration: number,
    baseDuration: number
  ) => void
} {
  const [profile, setProfile] = useState<RenderProfile | null>(null)
  const lastUpdateRef = useRef(0)

  const onRender = useCallback(
    (
      _id: string,
      _phase: 'mount' | 'update' | 'nested-update',
      actualDuration: number,
      baseDuration: number
    ) => {
      // Throttle state updates to avoid re-render cascades from profiling itself.
      // Update at most once per 500ms.
      const now = Date.now()
      if (now - lastUpdateRef.current < 500) return
      lastUpdateRef.current = now
      setProfile({ actualDuration, baseDuration })
    },
    []
  )

  if (!import.meta.env.DEV) {
    return { profile: null, onRender: () => {} }
  }

  return { profile, onRender }
}
