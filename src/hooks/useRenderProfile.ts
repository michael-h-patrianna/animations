/**
 * Hook that captures React Profiler render timing for a component.
 *
 * Returns the most recent `actualDuration` and `baseDuration` from
 * `<React.Profiler>` when profiling is enabled via the layout store toggle.
 * Returns `null` when profiling is off — callers should skip rendering Profiler.
 *
 * Use with `ProfilerWrapper` to add profiling around any component tree.
 */

import { useLayoutStore } from '@/demo-ui/stores/layoutStore'
import { useCallback, useRef, useState } from 'react'

/** Render timing data from React's Profiler API. */
export interface RenderProfile {
  /** Time spent rendering the committed update (ms). */
  actualDuration: number
  /** Estimated time to render the entire subtree without memoization (ms). */
  baseDuration: number
}

const NOOP_ON_RENDER = () => {}

/**
 * Captures render profiling data from React.Profiler callbacks.
 * Returns `null` when profiling is disabled — callers should skip rendering Profiler.
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
  const showProfiler = useLayoutStore((s) => s.showProfiler)
  const [profile, setProfile] = useState<RenderProfile | null>(null)
  const lastUpdateRef = useRef(0)

  const onRender = useCallback(
    (
      _id: string,
      _phase: 'mount' | 'update' | 'nested-update',
      actualDuration: number,
      baseDuration: number
    ) => {
      // Skip empty renders (e.g. null children before IntersectionObserver fires).
      // Without this, the first onRender records 0ms and the subsequent real render
      // is blocked by the throttle, leaving the badge stuck at "0.0ms".
      if (actualDuration < 0.01 && baseDuration < 0.01) return

      // Throttle state updates to avoid re-render cascades from profiling itself.
      // Update at most once per 500ms.
      const now = Date.now()
      if (now - lastUpdateRef.current < 500) return
      lastUpdateRef.current = now
      setProfile({ actualDuration, baseDuration })
    },
    []
  )

  if (!showProfiler) {
    return { profile: null, onRender: NOOP_ON_RENDER }
  }

  return { profile, onRender }
}
