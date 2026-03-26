/**
 * Conditional React.Profiler wrapper controlled by the profiler toggle.
 *
 * When enabled: wraps children with `<Profiler>` and forwards timing data
 * via the `onRender` callback from `useRenderProfile`.
 *
 * When disabled: renders children directly with zero overhead (no Profiler in tree).
 */

import { useLayoutStore } from '@/demo-ui/stores/layoutStore'
import { Profiler, type ReactNode } from 'react'

interface ProfilerWrapperProps {
  /** Profiler ID — typically the animation or component ID. */
  id: string
  /** Callback from useRenderProfile.onRender. */
  onRender: (
    id: string,
    phase: 'mount' | 'update' | 'nested-update',
    actualDuration: number,
    baseDuration: number
  ) => void
  children: ReactNode
}

/** Wraps children in React.Profiler when profiling is enabled, passes through otherwise. */
export function ProfilerWrapper({ id, onRender, children }: ProfilerWrapperProps) {
  const showProfiler = useLayoutStore((s) => s.showProfiler)

  if (!showProfiler) {
    return <>{children}</>
  }

  return (
    <Profiler id={id} onRender={onRender}>
      {children}
    </Profiler>
  )
}
